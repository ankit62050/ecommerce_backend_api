import { SubCategory } from "../models/subcategory.model.js";
import { Category } from "../models/category.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createSubCategory = asyncHandler(async (req, res) => {

    const {
        name,
        description,
        image,
        categoryId
    } = req.body;

    if (!name || !categoryId) {
        throw new ApiError(
            400,
            "Name and Category are required"
        );
    }

    const category =
        await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const existingSubCategory =
        await SubCategory.findOne({
            name
        });

    if (existingSubCategory) {
        throw new ApiError(
            409,
            "SubCategory already exists"
        );
    }

    const subCategory =
        await SubCategory.create({
            name,
            description,
            image,
            categoryId
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            subCategory,
            "SubCategory created successfully"
        )
    );
});

export const getAllSubCategories =
asyncHandler(async (req, res) => {

    const subCategories =
        await SubCategory.find()
            .populate("categoryId");

    return res.status(200).json(
        new ApiResponse(
            200,
            subCategories,
            "SubCategories fetched successfully"
        )
    );
});

export const getSubCategoryById =
asyncHandler(async (req, res) => {

    const subCategory =
        await SubCategory.findById(
            req.params.id
        ).populate("categoryId");

    if (!subCategory) {
        throw new ApiError(
            404,
            "SubCategory not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            subCategory,
            "SubCategory fetched successfully"
        )
    );
});

export const updateSubCategory =
asyncHandler(async (req, res) => {

    const subCategory =
        await SubCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

    if (!subCategory) {
        throw new ApiError(
            404,
            "SubCategory not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            subCategory,
            "SubCategory updated successfully"
        )
    );
});

export const deleteSubCategory =
asyncHandler(async (req, res) => {

    const subCategory =
        await SubCategory.findByIdAndDelete(
            req.params.id
        );

    if (!subCategory) {
        throw new ApiError(
            404,
            "SubCategory not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "SubCategory deleted successfully"
        )
    );
});