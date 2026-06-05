import { Router } from "express";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/")
    .get(getAllProducts)
    .post(
        verifyJWT,
        verifyAdmin,
        createProduct
    );

router.route("/:id")
    .get(getProductById)
    .patch(
        verifyJWT,
        verifyAdmin,
        updateProduct
    )
    .delete(
        verifyJWT,
        verifyAdmin,
        deleteProduct
    );

export default router;