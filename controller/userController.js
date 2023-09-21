import generateToken from "../config/jwtToken.js"
import User from "../models/User.js"
import Product from "../models/Product.js"
import Cart from "../models/Cart.js"
import Coupon from "../models/Coupon.js"
import Order from "../models/Order.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"
import generateRefreshToken from "../config/refreshToken.js"
import jwt from "jsonwebtoken"
import sendEmail from "./emailController.js"
import crypto from "crypto"
import uniqid from "uniqid"

const register = asyncHandler(async(req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({email})
    if (!findUser) {
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        throw new Error("User already exists")
    }
})

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    const findUser = await User.findOne({email})
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findUser?.id)
        const update = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id,)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

const loginAdmin = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    const findAdmin = await User.findOne({email})
    if (findAdmin.role !== "Admin")
        throw new Error("You're not authorised")
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findAdmin?.id)
        const update = await User.findByIdAndUpdate(
            findAdmin.id, 
            { refreshToken: refreshToken }, 
            { new: true }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id,)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken)
        throw new Error("No refresh token in cookies")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) 
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204)
})

const getAllUser = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find()   
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

const getUserByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getUser = await User.findById(id) 
        res.json(getUser)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteUser = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await User.findByIdAndDelete(id)   
        res.json({
            message: "Delete User successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {   
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            { new: true }
        )   
        res.json({
            message: "Update information User successfully",
            updateUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const blockUser = await User.findByIdAndUpdate(
            id, 
            { isBlocked: true }, 
            { new: true }
        )
        res.json(blockUser)
    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const unBlockUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: false }, 
            { new: true }
        )
        res.json(unBlockUser)
    } catch (error) {
        throw new Error(error)
    }
})

const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken)
        throw new Error("No refresh token in cookies")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if (!user)
        throw new Error("No refresh token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken})
    })
})

const changePassword = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {password} = req.body
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if (password) {
        user.password = password
        const changePassword = await user.save()
        res.json(changePassword)
    } else {
        res.json(user)
    }
})

const forgotPassworToken = asyncHandler(async(req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if (!user)  throw new Error("User not found with this email")
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, Please follow thi link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:4010/api/user/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            subject: "Forgot Account Password Link - TechTitans",
            text: "Hi! User",
            htm: resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

const resetPassword = asyncHandler(async(req, res) => {
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    if (!user) throw new Error("Token expired, please try again later")
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user)
})

const getWishList = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const findUser = await User.findById(_id).populate("wishList")
        res.json(findUser)
    } catch (error) {
        throw new Error(error)
    }
})

const saveAddress = asyncHandler(async(req, res, next) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            { address: req?.body?.address },
            { new: true }
        )   
        res.json({
            message: "Update information User successfully",
            updateUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

const addItemsToCart = asyncHandler(async(req, res, next) => {
    const {cart} = req.body
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        let products = []
        const user = await User.findById(_id)
        // check if user already have product in cart
        const alreadyExistsCart = await Cart.findOne({orderBy: user._id})
        if (alreadyExistsCart) {
            alreadyExistsCart.remove()
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id).select("price").exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }
})

const getCart = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const cart = await Cart.findOne({orderBy: _id}).populate("products.product")
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

const emptyCart = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const emptyCart = await Cart.findOneAndRemove({orderBy: _id})
        res.json(emptyCart)
    } catch (error) {
        throw new Error(error)
    }
})

const applyCoupon = asyncHandler(async(req, res) => {
    const {coupon} = req.body
    const {_id} = req.user
    validateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({name: coupon})
    if (validCoupon === null) {
        throw new Error("Invalid Coupon")
    }
    let {cartTotal} = await Cart.findOne({orderBy: _id}).populate("products.product")
    let priceDiscount = (cartTotal * validCoupon.discount)/100
    let totalAfterDiscount = (cartTotal - priceDiscount).toFixed(2)
    await Cart.findOneAndUpdate(
        { orderBy: _id },
        { totalAfterDiscount },
        { new: true}
    )
    res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async(req, res) => {
    const {COD, couponApplied} = req.body
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        if (!COD)
            throw new Error("Create cash order failed")
        let cart = await Cart.findOne({orderBy: _id})
        let finalAmout = 0
        if (couponApplied && cart.totalAfterDiscount) {
            finalAmout = cart.totalAfterDiscount
        } else {
            finalAmout = cart.cartTotal
        }
        let now = Date.now()
        await new Order({
            products: cart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmout,
                status: "Cash on Delivery",
                created: now,
                currency: "vnd"
            },
            orderBy: _id,
            orderStatus: "Cash on Delivery"
        }).save()
        let update = cart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count, sold: +item.count}}
                }
            }
        })
        await Product.bulkWrite(update, {})
        res.json({
            message: "Success"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    validateMongoDbId(_id)
    try {
        const order = await Order.findOne({orderBy: _id}).populate("products.product").exec()
        res.json(order)
    } catch (error) {
        throw new Error(error)
    }
})

const updateStatusOrder = asyncHandler(async(req, res) => {
    const {status} = req.body
    const {id} = req.params
    validateMongoDbId(id)
    try {
        let now = Date.now()
        const updateOrder = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                    update: now
                }
            },
            { new: true }
        )
        res.json(updateOrder)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    register,
    login,
    loginAdmin,
    logout,
    getAllUser,
    getUserByID,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    changePassword,
    forgotPassworToken,
    resetPassword,
    getWishList,
    saveAddress,
    addItemsToCart,
    getCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    updateStatusOrder,
}