import express from "express"
import dotenv from "dotenv"
import dbConnect from "./config/dbConnect.js"
import authRouter from "./routes/authRoute.js"
import productRouter from "./routes/productRoute.js"
import blogRouter from "./routes/blogRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import blogCATRouter from "./routes/blogCATRoute.js"
import brandRouter from "./routes/brandRoute.js"
import couponRouter from "./routes/couponRoute.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4012
dbConnect()

//middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

//route
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)
app.use("/api/category", categoryRouter)
app.use("/api/blogCategory", blogCATRouter)
app.use("/api/brand", brandRouter)
app.use("/api/coupon", couponRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
