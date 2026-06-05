import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subcategory.model.js";
import { Brand } from "../models/brand.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        stock,
        categoryId,
        subCategoryId,
        brandId
    } = req.body;

    if (
        !name ||
        !description ||
        !price ||
        !categoryId ||
        !subCategoryId ||
        !brandId
    ) {
        throw new ApiError(
            400,
            "All required fields must be provided"
        );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        throw new ApiError(
            404,
            "SubCategory not found"
        );
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        throw new ApiError(
            409,
            "Product with this name already exists"
        );
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
        throw new ApiError(
            404,
            "Brand not found"
        );
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        categoryId,
        subCategoryId,
        brandId
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {

    const {
        keyword,
        categoryId,
        subCategoryId,
        brandId,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10
    } = req.query;

    const query = {
        isActive: true
    };

    // Search
    if (keyword) {
        query.name = {
            $regex: keyword,
            $options: "i"
        };
    }

    // Filter by Category
    if (categoryId) {
        query.categoryId = categoryId;
    }

    // Filter by SubCategory
    if (subCategoryId) {
        query.subCategoryId = subCategoryId;
    }

    // Filter by Brand
    if (brandId) {
        query.brandId = brandId;
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {

        query.price = {};

        if (minPrice) {
            query.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            query.price.$lte = Number(maxPrice);
        }
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip =
        (pageNumber - 1) * limitNumber;

    // Sorting
    let sortOption = {};

    if (sort === "price") {
        sortOption.price = 1;
    }

    if (sort === "-price") {
        sortOption.price = -1;
    }

    if (sort === "rating") {
        sortOption.rating = -1;
    }

    if (sort === "newest") {
        sortOption.createdAt = -1;
    }

    const totalProducts =
        await Product.countDocuments(query);

    const products =
        await Product.find(query)
            .populate("categoryId", "name")
            .populate("subCategoryId", "name")
            .populate("brandId", "name")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalProducts,
                currentPage: pageNumber,
                totalPages: Math.ceil(
                    totalProducts / limitNumber
                ),
                products
            },
            "Products fetched successfully"
        )
    );
});


export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("categoryId", "name")
        .populate("subCategoryId", "name")
        .populate("brandId", "name");

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        )
    );
});

export const updateProduct = asyncHandler(async (req, res) => {

    const product =
        await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );
});

export const deleteProduct = asyncHandler(async (req, res) => {

    const product =
        await Product.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false
            },
            {
                new: true
            }
        );

    if (!product) {
        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Product deleted successfully"
        )
    );
});

// export const getProductsByCategory = asyncHandler(async (req, res) => {
//     const { categoryId } = req.params;

//     const products = await Product.find({ categoryId, isActive: true })
//         .populate("categoryId", "name")
//         .populate("subCategoryId", "name")
//         .populate("brandId", "name");

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             products,
//             "Products fetched successfully"
//         )
//     );
// });


