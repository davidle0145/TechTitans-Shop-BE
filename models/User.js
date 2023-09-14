//!mdbgum: create User model
import mongoose from "mongoose"
import bcrypt from "bcrypt"
const ObjectId = mongoose.Types.ObjectId

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    mobile:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: "user",
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    cart:{
        type: Array,
        default: [],
    },
    address: [{
        type: ObjectId,
        ref: "Address",
    }],
    wishList: [{
        type: ObjectId,
        ref: "Product",
    }],
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Export the model
export default mongoose.model('User', userSchema);