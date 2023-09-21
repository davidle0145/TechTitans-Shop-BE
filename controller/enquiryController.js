import Enquiry from "../models/Enquiry.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"

const createEnquiry = asyncHandler(async(req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body)
        res.json(newEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteEnquiry = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await Enquiry.findByIdAndDelete(id)
        res.json({
            message: "Delete Enquiry successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateEnquiry = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.json(updateEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllEnquiry = asyncHandler(async(req, res) => {
    try {
        const getEnquirys = await Enquiry.find()
        res.json(getEnquirys)
    } catch (error) {
        throw new Error(error)
    }
})

const getEnquiryByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getEnquiry = await Enquiry.findById(id)
        res.json(getEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createEnquiry,
    deleteEnquiry,
    updateEnquiry,
    getAllEnquiry,
    getEnquiryByID
}