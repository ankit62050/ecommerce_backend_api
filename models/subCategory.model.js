import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    image: {
        type: String
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
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

export const SubCategory = mongoose.model(
    "SubCategory",
    subCategorySchema
);