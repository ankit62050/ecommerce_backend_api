import { Router } from "express";

import {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} from "../controllers/brand.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/")
    .get(getAllBrands)
    .post(
        verifyJWT,
        verifyAdmin,
        createBrand
    );

router.route("/:id")
    .get(getBrandById)
    .patch(
        verifyJWT,
        verifyAdmin,
        updateBrand
    )
    .delete(
        verifyJWT,
        verifyAdmin,
        deleteBrand
    );

export default router;