import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "UPI", "CARD"]
    },

    paymentStatus: {
        type: String,
        enum: [
            "PENDING",
            "PAID",
            "FAILED",
            "REFUNDED"
        ],
        default: "PENDING"
    },

    orderStatus: {
        type: String,
        enum: [
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ],
        default: "PENDING"
    },

    totalAmount: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
}
);

export const Order = mongoose.model(
    "Order",
    orderSchema
);