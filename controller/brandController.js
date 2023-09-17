import Brand from "../models/Brand.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"

const createBrand = asyncHandler(async(req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBrand = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await Brand.findByIdAndDelete(id)
        res.json({
            message: "Delete Brand successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateBrand = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateBrand = await Brand.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBrand = asyncHandler(async(req, res) => {
    try {
        const getBrands = await Brand.find()
        res.json(getBrands)
    } catch (error) {
        throw new Error(error)
    }
})

const getBrandByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createBrand,
    deleteBrand,
    updateBrand,
    getAllBrand,
    getBrandByID
}