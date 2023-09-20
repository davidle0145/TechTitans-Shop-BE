import express from "express"
import { 
    createBlog, 
    deleteBlog, 
    dislikeBlog, 
    getAllBlog, 
    getBlogByID, 
    likeBlog, 
    updateBlog, 
    uploadImages
} from "../controller/blogController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"
import { blogImgResize, uploadImage } from "../middlewares/uploadImage.js"

const router = express.Router()

router.get("/", getAllBlog)
router.get("/:id", getBlogByID)
router.put("/like", authMiddleware, likeBlog)
router.put("/dislike", authMiddleware, dislikeBlog)
router.put("/upload/:id", authMiddleware, isAdmin, uploadImage.array("images",2), blogImgResize, uploadImages)
router.post("/create", authMiddleware, isAdmin, createBlog)
router.put("/:id", authMiddleware, isAdmin, updateBlog)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

export default router