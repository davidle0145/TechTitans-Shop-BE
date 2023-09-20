import Blog from "../models/Blog.js"
import User from "../models/User.js"
import asyncHandler from "express-async-handler"
import validateMongoDbId from "../utils/validateDBId.js"
import cloudinaryUploadImg from "../utils/cloudinary.js"
import fs from "fs"

const createBlog = asyncHandler(async(req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(
            id, 
            req.body,
            { new: true}
        )
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        await Blog.findByIdAndDelete(id)
        res.json({
            message: "Delete Blog successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlog = asyncHandler(async(req, res) => {
    try {
        const getBlogs = await Blog.find()
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlogByID = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes")
        const updateViewBlog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { numViews: 1} },
            { new: true }
        )
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.body
    validateMongoDbId(blogId)

    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isLiked = blog?.isLiked
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString())
    
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $pull: {dislikes: loginUserId},
                isDisliked: false
            },
            { new: true}
        )
        res.json(blog)
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $pull: {likes: loginUserId},
                isLiked: false
            },
            { new: true}
        )
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $push: {likes: loginUserId},
                isLiked: true
            },
            { new: true}
        )
        res.json(blog)
    }
})

const dislikeBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.body
    validateMongoDbId(blogId)

    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isDisliked = blog?.isDisliked
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString())
    
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $pull: {likes: loginUserId},
                isLiked: false
            },
            { new: true}
        )
        res.json(blog)
    }

    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $pull: {dislikes: loginUserId},
                isDisliked: false
            },
            { new: true}
        )
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            { 
                $push: {dislikes: loginUserId},
                isDisliked: true
            },
            { new: true}
        )
        res.json(blog)
    }
})

const uploadImages = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const upload = (path) => cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files
        for (const file of files) {
            const {path} = file
            const newPath = await upload(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const updateBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls.map((file) => {
                return file
            })},
            { new: true }
        )
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlog,
    getBlogByID,
    likeBlog,
    dislikeBlog,
    uploadImages,
}