import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import userRoutes from './routes/users.js';
import authRoutes from './routes/auths.js';
import tweetRoutes from './routes/tweets.js';
import cookieParser from "cookie-parser";


const app = express();
dotenv.config();

const connect = () => {
    mongoose
      .connect(process.env.MONGO)
      .then(() => {
        console.log("connected to mongoDB database");
      })
      .catch((err) => {
        throw err;
      });
};

// app.get('/', (req, res) => {
//     res.send("Hello!");
// })

// Need cookie parser to be able to access req.cookies
app.use(cookieParser());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(8000, () => {
    connect();
    console.log('listening to port 8000');
});

