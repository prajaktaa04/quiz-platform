const Category = require("../models/category");


// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || ""
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error.message);

        res.status(500).json({
            message: "Server error while creating category"
        });
    }
};


// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error.message);

        res.status(500).json({
            message: "Server error while fetching categories"
        });
    }
};


// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            category
        });

    } catch (error) {
        res.status(500).json({
            message: "Invalid category ID"
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (name) {
            const existingCategory = await Category.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(409).json({
                    message: "Another category with this name already exists"
                });
            }

            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Update category error:", error.message);

        res.status(500).json({
            message: "Server error while updating category"
        });
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await category.deleteOne();

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error.message);

        res.status(500).json({
            message: "Server error while deleting category"
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};