import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: ObjectId,
        ref: "User"
    }],
    images: [],
    author: {
        type: String,
        default: "Admin"
    },
}, { 
    timestamps: true, 
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});

//Export the model
export default mongoose.model('Blog', blogSchema);