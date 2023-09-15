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
} from "../controller/userController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)

router.post("/forgot-password-token", forgotPassworToken)
router.put("/reset-password/:token", resetPassword)
router.put("/password", authMiddleware, changePassword)

router.get("/", getAllUser)
router.get("/refresh", handleRefreshToken)
router.get("/:id", authMiddleware, isAdmin, getUserByID)
router.delete("/:id", deleteUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

export default router