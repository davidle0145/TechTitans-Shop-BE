import Product from "../models/Product.js"
import User from "../models/User.js"
import asyncHandler from "express-async-handler"
import slugify from "slugify"
import validateMongoDbId from "../utils/validateDBId.js"
import {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} from "../utils/cloudinary.js"
import fs from "fs"

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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
    try {
        const getProduct = await Product.findById(id) 
        res.json(getProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const addToWishList = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {productID} = req.body
    let userUpdate
    try {
        const user = await User.findById(_id)
        const alreadyAdded = user.wishList.find((id) => id.toString() === productID)
        if (alreadyAdded) {
            userUpdate = await User.findByIdAndUpdate(
                _id, 
                { $pull: {wishList: productID} },
                { new: true}
            )
            res.json(userUpdate)
        } else {
            userUpdate = await User.findByIdAndUpdate(
                _id, 
                { $push: {wishList: productID} },
                { new: true}
            )
            res.json(userUpdate)
        }
    } catch (error) {
        throw new Error(error)
    }
})

const rating = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {star, productID, comment} = req.body
    try {
        const product = await Product.findById(productID)
        let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString())
        if (alreadyRated) {
            await Product.updateOne(
                { ratings: { $elemMatch: alreadyRated}},
                { $set: { "ratings.$.star": star, "ratings.$.comment": comment}},
                { new: true }
            )
        } else {
            await Product.findByIdAndUpdate(
                productID,
                { $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id
                    }
                }},
                { new: true }
            )
        }

        const getAllRatings = await Product.findById(productID)
        let lengthRating = getAllRatings.ratings.length
        let totalRating = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => (prev + curr), 0)
        let actualRating = Math.round(totalRating / lengthRating)
        
        let productUpdate = await Product.findByIdAndUpdate(
            productID, 
            { totalRating: actualRating},
            { new: true }
        ) 
        res.json(productUpdate)
    } catch (error) {
        throw new Error(error)
    }

})

const uploadImages = asyncHandler(async(req, res) => {
    try {
        const upload = (path) => cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files
        for (const file of files) {
            const {path} = file
            const newPath = await upload(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const images = urls.map((file) => {
            return file
        })
        res.json(images)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteImages = asyncHandler(async(req, res) => {
    const {id} = req.params
    try {
        await cloudinaryDeleteImg(id, "images")
        res.json({
            message: "Deleted Image in Cloudinary Successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getProductByID,
    addToWishList,
    rating,
    uploadImages,
    deleteImages,
}