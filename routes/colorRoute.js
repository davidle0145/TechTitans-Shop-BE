import express from "express"
import { 
    createColor,
    deleteColor,
    getAllColor, 
    getColorByID, 
    updateColor,
} from "../controller/colorController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllColor)
router.get("/:id", getColorByID)
router.post("/create", authMiddleware, isAdmin, createColor)
router.put("/:id", authMiddleware, isAdmin, updateColor)
router.delete("/:id", authMiddleware, isAdmin, deleteColor)

export default router