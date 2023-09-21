import express from "express"
import {
    blockUser,
    deleteUser, 
    getAllUser, 
    getUserByID, 
    handleRefreshToken, 
    login, 
    logout, 
    register, 
    unblockUser, 
    changePassword, 
    updateUser,
    forgotPassworToken,
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    addItemsToCart,
    getCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    updateStatusOrder,
} from "../controller/userController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/admin-login", loginAdmin)
router.get("/cart", authMiddleware, getCart)
router.get("/order", authMiddleware, getOrder)
router.post("/cart", authMiddleware, addItemsToCart)
router.post("/cart/coupon", authMiddleware, applyCoupon)
router.post("/cart/cash-order", authMiddleware, createOrder)
router.put("/order/:id", authMiddleware, isAdmin, updateStatusOrder)
router.get("/logout", logout)

router.post("/forgot-password-token", forgotPassworToken)
router.put("/reset-password/:token", resetPassword)
router.put("/password", authMiddleware, changePassword)

router.get("/", getAllUser)
router.get("/refresh", handleRefreshToken)
router.get("/wishList", authMiddleware, getWishList)
router.get("/:id", authMiddleware, isAdmin, getUserByID)
router.delete("/empty-cart", authMiddleware, emptyCart)
router.delete("/:id", deleteUser)
router.put("/save-address", authMiddleware, saveAddress)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

export default router