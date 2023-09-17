import express from "express"
import { 
    createBrand,
    deleteBrand,
    getAllBrand, 
    getBrandByID, 
    updateBrand,
} from "../controller/brandController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllBrand)
router.get("/:id", getBrandByID)
router.post("/create", authMiddleware, isAdmin, createBrand)
router.put("/:id", authMiddleware, isAdmin, updateBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)

export default router