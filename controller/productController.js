import Product from "../models/Product.js"
import asyncHandler from "express-async-handler"
import slugify from "slugify"

const createProduct = asyncHandler(async(req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async(req, res) => {
    const {id} = req.params
    try {
        await Product.findByIdAndDelete(id)
        res.json({
            message: "Delete Product successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async(req, res) => {
    const {id} = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async(req, res) => {
    let query
    try {
        // filtering
        const queryObj = {...req.query}
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`)
        query = Product.find(JSON.parse(queryStr))
        
        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createAt")
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select("-__v")
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount)
                throw new Error("This page does not exists")
        }

        const getProducts = await query
        res.json(getProducts)
    } catch (error) {
        throw new Error(error)
    }
})

const getProductByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    try {
        const getProduct = await Product.findById(id) 
        res.json(getProduct)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getProductByID
}