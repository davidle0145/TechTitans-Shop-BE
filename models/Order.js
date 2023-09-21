import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String
    }],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
    },
    orderBy: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

//Export the model
export default mongoose.model('Order', orderSchema);