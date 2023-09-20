import express from "express"
import { 
    createCoupon,
    deleteCoupon,
    getAllCoupon, 
    getCouponByID, 
    updateCoupon,
} from "../controller/couponController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllCoupon)
router.get("/:id", getCouponByID)
router.post("/create", authMiddleware, isAdmin, createCoupon)
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon)
router.put("/:id", authMiddleware, isAdmin, updateCoupon)

export default router