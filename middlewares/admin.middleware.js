import ApiError from "../utils/apiError.js";

export const verifyAdmin = (req, res, next) => {

    if (!req.user) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    if (req.user.role !== "admin") {
        throw new ApiError(
            403,
            "Access denied. Admin privileges required."
        );
    }

    next();
};