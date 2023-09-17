import express from "express"
import { 
    createBlogCAT,
    deleteBlogCAT,
    getAllBlogCAT,
    getBlogCATByID, 
    updateBlogCAT,
} from "../controller/blogCATController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllBlogCAT)
router.get("/:id", getBlogCATByID)
router.post("/create", authMiddleware, isAdmin, createBlogCAT)
router.put("/:id", authMiddleware, isAdmin, updateBlogCAT)
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCAT)

export default router