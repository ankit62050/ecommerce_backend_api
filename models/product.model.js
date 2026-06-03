import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    },

    images: [
        {
            type: String
        }
    ],

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },

    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },

    rating: {
        type: Number,
        default: 0
    },

    numReviews: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

export const Product = mongoose.model(
    "Product",
    productSchema
);