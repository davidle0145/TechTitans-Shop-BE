import cloudinary from "cloudinary"
import dotenv from "dotenv"

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
})

const cloudinaryUploadImg = async(fileToUpLoads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpLoads, (result) => {
            resolve(
                { 
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id
                },
                { resource_type: "auto" }
            )
        })
    })
}

const cloudinaryDeleteImg = async(fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve(
                { 
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id
                },
                { resource_type: "auto" }
            )
        })
    })
}

export {
    cloudinaryUploadImg,
    cloudinaryDeleteImg
} 