import Category from "../models/Category.js";

// CREATE CATEGORY - Admin only
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const categoryExists = await Category.findOne({
      name: name.trim(),
    });

    if (categoryExists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY - Admin only
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// DELETE CATEGORY - Admin only
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};