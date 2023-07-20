import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";

export const createTweet = async (req, res, next) => {
    // Create a new tweet by sending a JSON
    // with a userId and description
    const newTweet = new Tweet(req.body);
    try{
        const savedTweet = await newTweet.save();
        res.status(200).json(savedTweet);
    }catch(err){
        handleError(500, err);
    }
}

export const deleteTweet = async (req, res, next) => {
    try{
        // Get tweet from ID in URL
        const tweet = await Tweet.findById(req.params.id);
        // The tweet has a userId associated with it
        // If the userId is the same as the user trying to delete the tweet
        // then delete it
        if(tweet.userId === req.body.id){
            await tweet.deleteOne();
            res.status(200).json('tweet has been deleted');
        }
        else(
            handleError(500, err)
        )
    }catch(err){
        handleError(500, err);
    }
};

export const likeOrDislike = async (req, res, next) => {
    try{
        const tweet = await Tweet.findById(req.params.id);
        if(!tweet.likes.includes(req.body.id)) {
            await tweet.updateOne({
                $push: {
                    likes: req.body.id
                }
            })
            res.status(200).json('tweet has been liked')
        }else{
            await tweet.updateOne({
              $pull: {
                likes: req.body.id,
              },
            });
            res.status(200).json('tweet has been unliked')
        }
    }catch(err){
        handleError(500, err);
    }
};

export const getAllTweets = async (req, res, next) => {
  try{
    const currentUser = await User.findById(req.params.id);
    const userTweets = await Tweet.find({
        userId: currentUser._id
    });
    // Getting all of the userIds of users that you are following
    // then returning all tweets associated with their userId (returning all of their tweets)
    const followersTweets = await Promise.all(currentUser.following.map((followerId)=> {
        return Tweet.find({userId: followerId})
    }))
    // Merging together all of the users tweets and their followers tweets
    res.status(200).json(userTweets.concat(...followersTweets))
  }catch(err){
    handleError(500, err);
  }
};

export const getUserTweets = async (req, res, next) => {
    try{
        // const currentUser = await User.findById(req.params.id);
        // const userTweets = await Tweet.find({
        //   userId: currentUser._id,
        // });
        // Getting all tweets for the user who's ID is in the URL and sorting by most recent
        const userTweets = await Tweet.find({userId: req.params.id}).sort({
            createdAt: -1,
        })
        res.status(200).json(userTweets);
    }catch(err){
        handleError(500, err);
    }
};

export const getExploreTweets = async (req, res, next) => {
    try{
        // Getting all tweets with likes and sorting by most liked
        const getExploreTweets = await Tweet.find({likes: {
            $exists: true
        }}).sort({
            likes: -1
        })
        res.status(200).json(getExploreTweets);
    }catch(err){
        handleError(500, err);
    }
};