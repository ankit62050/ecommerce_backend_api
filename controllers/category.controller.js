import Category from "../models/user.model.js";
import asyncHandler from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

export const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description, image } = req.body;

    if(!name || !description || !image) {
        throw new apiError(400, "All fields are required");
    }

    const existingCategory = await Category.findOne({ name });

    if(existingCategory) {
        throw new apiError(409, "Category with this name already exists");
    }

    const category = await Category.create({
        name,
        description,
        image
    });

    return res.status(201).json(
        new apiResponse(
            201,
            "Category created successfully",
             category
        )
    );
});

export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();

    return res.status(200).json(
        new apiResponse(
            200,
            "Categories fetched successfully",
            categories,
        )
    );
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if(!category) {
        throw new apiError(404, "Category not found");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            "Category fetched successfully",
            category
        )
    );
});

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await Category.findById(id);

    if(!category) {
        throw new apiError(404, "Category not found");
    }

    if(name) category.name = name;
    if(description) category.description = description;
    if(image) category.image = image;

    const updatedCategory = await category.save();

    return res.status(200).json(
        new apiResponse(
            200,
            "Category updated successfully",
            updatedCategory
            
        )
    );
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;  
    const category = await Category.findById(id);

    if(!category) {
        throw new apiError(404, "Category not found");
    }

    await category.remove();

    return res.status(200).json(
        new apiResponse(
            200,
            "Category deleted successfully",
            null
        )
    );
});
