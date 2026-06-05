import Brand from "../models/brand.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createBrand = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;

    if (!name || !description || !image) {
        throw new ApiError(400, "All fields are required");
    }

    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
        throw new ApiError(409, "Brand already exists");
    }

    const brand = await Brand.create({
        name,
        description,
        image
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            brand,
            "Brand created successfully"
        )
    );
});

export const getAllBrands = asyncHandler(async (req, res) => {

    const brands = await Brand.find();

    return res.status(200).json(
        new ApiResponse(
            200,
            brands,
            "Brands fetched successfully"
        )
    );
});

export const getBrandById = asyncHandler(async (req, res) => {

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            brand,
            "Brand fetched successfully"
        )
    );
});

export const updateBrand = asyncHandler(async (req, res) => {

    const brand = await Brand.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            brand,
            "Brand updated successfully"
        )
    );
});

export const deleteBrand = asyncHandler(async (req, res) => {

    const brand = await Brand.findByIdAndDelete(
        req.params.id
    );

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Brand deleted successfully"
        )
    );
});