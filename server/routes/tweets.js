import express from 'express';
import { verifyToken } from '../verifyToken.js';
import { createTweet, deleteTweet, likeOrDislike, getAllTweets, getUserTweets, getExploreTweets } from '../controllers/tweet.js';


const router = express.Router();

// Create Tweet
router.post('/', verifyToken, createTweet);

// Delete tweet
router.delete('/:id', verifyToken, deleteTweet);

// Like/Dislike Tweet
router.put('/:id/like', likeOrDislike);

// Get all timeline tweets (Your tweets and your followers tweets)
router.get('/timeline/:id', getAllTweets);

// Get signed in user's tweets
router.get('/user/all/:id', getUserTweets);

// Explore
router.get('/explore', getExploreTweets);


export default router;