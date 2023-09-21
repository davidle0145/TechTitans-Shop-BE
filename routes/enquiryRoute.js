import express from "express"
import { 
    createEnquiry,
    deleteEnquiry,
    getAllEnquiry, 
    getEnquiryByID, 
    updateEnquiry,
} from "../controller/enquiryController.js"
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", getAllEnquiry)
router.get("/:id", getEnquiryByID)
router.post("/create", createEnquiry)
router.put("/:id", authMiddleware, isAdmin, updateEnquiry)
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry)

export default router