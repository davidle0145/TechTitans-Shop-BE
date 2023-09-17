import express from "express"
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategoryByID,
    updateCategory,
} from "../controller/categoryController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllCategory)
router.get("/:id", getCategoryByID)
router.post("/create", authMiddleware, isAdmin, createCategory)
router.put("/:id", authMiddleware, isAdmin, updateCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)

export default router