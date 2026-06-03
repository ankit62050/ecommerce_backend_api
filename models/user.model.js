import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        unique: true
    },

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    refreshToken: {
        type: String
    }
},
{
    timestamps: true
}
);


userSchema.pre("save",async function(next){  // donst work with arrow function because of this keyword
    if(!this.isModified("password")){
        return next();
    }

    const password = await bcrypt.hash(this.password,10);
    this.password = password;
    next();
});


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({
        userId: this._id,
        role: this.role
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        userId: this._id,
        role: this.role
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
    })
}


 const User = mongoose.model("User", userSchema);

 export default User;