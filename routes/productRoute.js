import express from "express"
import {
    addToWishList,
    createProduct, 
    deleteImages, 
    deleteProduct, 
    getAllProduct, 
    getProductByID, 
    rating, 
    updateProduct,
    uploadImages,
} from "../controller/productController.js"
import {productImgResize, uploadImage} from "../middlewares/uploadImage.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllProduct)
router.get("/:id", getProductByID)
router.put("/upload", authMiddleware, isAdmin, uploadImage.array("images",10), productImgResize, uploadImages)
router.put("/wishList", authMiddleware, addToWishList)
router.put("/rating", authMiddleware, rating)
router.post("/create", authMiddleware, isAdmin, createProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages)
router.put("/:id", authMiddleware, isAdmin, updateProduct)

export default router