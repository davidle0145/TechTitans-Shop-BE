import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    color: {
        type: String,
        required: true,
    },
    ratings: [{
        star: {
            type: Number
        },
        comment: {
            type: String
        },
        postedBy: {
            type: ObjectId,
            ref: "User"
        }
    }],
    totalRating: {
        type: String,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
export default mongoose.model('Product', productSchema);