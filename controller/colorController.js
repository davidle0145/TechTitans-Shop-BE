import Color from "../models/Color.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"

const createColor = asyncHandler(async(req, res) => {
    try {
        const newColor = await Color.create(req.body)
        res.json(newColor)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await Color.findByIdAndDelete(id)
        res.json({
            message: "Delete Color successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateColor = await Color.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateColor)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllColor = asyncHandler(async(req, res) => {
    try {
        const getColors = await Color.find()
        res.json(getColors)
    } catch (error) {
        throw new Error(error)
    }
})

const getColorByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getColor = await Color.findById(id)
        res.json(getColor)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createColor,
    deleteColor,
    updateColor,
    getAllColor,
    getColorByID
}