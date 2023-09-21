import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String,
        price: Number
    }],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

//Export the model
export default mongoose.model('Cart', cartSchema);