import { Router } from "express";

import {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} from "../controllers/subcategory.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/")
    .get(getAllSubCategories)
    .post(
        verifyJWT,
        verifyAdmin,
        createSubCategory
    );

router.route("/:id")
    .get(getSubCategoryById)
    .patch(
        verifyJWT,
        verifyAdmin,
        updateSubCategory
    )
    .delete(
        verifyJWT,
        verifyAdmin,
        deleteSubCategory
    );

export default router;