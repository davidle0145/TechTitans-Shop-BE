import User from "../models/User.js"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not authorized token expired, Please login again!")
        }
    } else {
        throw new Error("There is no token attached to header")
    }
})

const isAdmin = asyncHandler(async(req, res, next) => {
    const {email} = req.user
    const user = await User.findOne({email})
    if (user.role !== "Admin") {
        throw new Error("You are not an admin")
    } else {
        next()
    }
})

export {
    authMiddleware,
    isAdmin
}