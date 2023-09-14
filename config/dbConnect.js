import mongoose from "mongoose"

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
        })
        console.log("MongoDB Connection Succeeded")
    } catch (error) {
        console.log("Error in DB connection: " + error)
    }
}

export default dbConnect