import User from "../models/user.model.js";
import asyncHandler from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);       
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};

    }     catch (error) {
        throw new apiError(500, "Failed to generate tokens");
    }
}

export const registerUser =  asyncHandler(async (req,res,next)=>{
    //  console.log("REGISTER ROUTE HIT");
    const{fullName,email,password,phone} = req.body;

    if(
        [fullName,email,password,phone].some((field)=>field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or:[{email}, {phone}]
});

    if(existingUser){
        throw new apiError(409, "User with this email or phone already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        phone
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken"); // here User not user because we want to use the model method to hide password and refresh token from response

    if(!userCreated){
        throw new apiError(500, "Failed to create user");
    }

    user.password = undefined;


    return res.status(201).json(new apiResponse(200, "User registered successfully", userCreated));

})


export const loginUser = asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || password){
    throw new apiError(400,"email or password is required")
}

    const user = await User.findOne({email});

    if(!user){
        throw new apiError(401, "Invalid email or password");
    }

    const isPasswordValid  = await user.comparePassword(password);
    if(!isPasswordValid){
        throw new apiError(401, "Invalid email or password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const logdedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
    httpOnly: true,
    secure:true,
}

return res.status(200)
    .cookie("refreshToken", refreshToken, options) // even though humne yaha tokens bhej diye hai
    .cookie("accessToken", accessToken, options)
    .json(
        new apiResponse(200, 
            {user: logdedInUser, accessToken, refreshToken}, // phir bhi humne response me tokens bhej diye hai taki frontend easily access kar sake, kyuki kuch cases me frontend ko access token ki zarurat hoti hai jaise ki socket connection establish karte time
            "User logged in successfully")
    )

})

export const logoutUser = asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(req.user._id, 
        // {refreshToken: null}, // unset the refresh token in the database to invalidate it another way
        {
            $unset: {refreshToken: 1} // this will remove the refresh token field from the user document in the database, effectively invalidating any existing refresh tokens for that user
        },
        {new: true});

    const options = {
    httpOnly: true,
    secure:true,
}
    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken", options)
    .json(
        new apiResponse(200, null, "User logged out successfully")
    )


})

export const currentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            "User fetched successfully",
            req.user
        )
    );
})

export const changePassword = asyncHandler(async(req,res,next) =>{
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword){
        throw new apiError(400, "current password and new password are required");
    }

    const user = await User.findById(req.user._id);

    if(!user){
        throw new apiError(404, "User not found");
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if(!isCurrentPasswordValid){
        throw new apiError(401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(
    new ApiResponse(
        200,
        {},
        "Password changed successfully"
    )
);
})

export const updateUserProfile = asyncHandler(async (req, res) => {

    const { fullName, email, phone } = req.body;

    if (!fullName && !email && !phone) {
        throw new apiError(
            400,
            "At least one field is required"
        );
    }

    // Check if email already exists
    if (email) {
        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            throw new apiError(
                409,
                "Email already exists"
            );
        }
    }

    // Check if phone already exists
    if (phone) {
        const existingUser = await User.findOne({
            phone,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            throw new apiError(
                409,
                "Phone number already exists"
            );
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(phone && { phone })
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new apiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );
});