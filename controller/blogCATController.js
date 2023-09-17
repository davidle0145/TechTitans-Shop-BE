import BlogCAT from "../models/BlogCAT.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"

const createBlogCAT = asyncHandler(async(req, res) => {
    try {
        const newBlogCAT = await BlogCAT.create(req.body)
        res.json(newBlogCAT)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlogCAT = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await BlogCAT.findByIdAndDelete(id)
        res.json({
            message: "Delete BlogCAT successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlogCAT = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateBlogCAT = await BlogCAT.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateBlogCAT)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlogCAT = asyncHandler(async(req, res) => {
    try {
        const getBlogCATs = await BlogCAT.find()
        res.json(getBlogCATs)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlogCATByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getBlogCAT = await BlogCAT.findById(id)
        res.json(getBlogCAT)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createBlogCAT,
    deleteBlogCAT,
    updateBlogCAT,
    getAllBlogCAT,
    getBlogCATByID
}