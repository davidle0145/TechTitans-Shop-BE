import Category from "../models/Category.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"

const createCategory = asyncHandler(async(req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await Category.findByIdAndDelete(id)
        res.json({
            message: "Delete Category successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandler(async(req, res) => {
    try {
        const getCategories = await Category.find()
        res.json(getCategories)
    } catch (error) {
        throw new Error(error)
    }
})

const getCategoryByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createCategory,
    deleteCategory,
    updateCategory,
    getAllCategory,
    getCategoryByID
}