import express from "express"
import {
    createProduct, 
    deleteProduct, 
    getAllProduct, 
    getProductByID, 
    updateProduct,
} from "../controller/productController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/create", authMiddleware, isAdmin, createProduct)
router.get("/", getAllProduct)
router.get("/:id", getProductByID)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)

export default router