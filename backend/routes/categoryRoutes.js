const express = require("express");

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get all categories
router.get(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    getCategories
);


// Get single category
router.get(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    getCategoryById
);


// Create category
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createCategory
);


// Update category
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateCategory
);


// Delete category
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteCategory
);


module.exports = router;