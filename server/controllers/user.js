import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        next(err);
    }
}

export const update = async (req, res, next) => {
    if(req.params.id === req.user.id) {
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, 
                {
                    $set: req.body,
                },
                {
                    new: true,
                }
            );
            res.status(200).json(updatedUser);
        }catch(err){
            next(err);
        }}
        else {
            return next(handleError(403, 'You can only update your own account'))
        }
    };

    export const deleteUser = async (req, res, next) => {
      if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            await Tweet.removeAllListeners({iuserId: req.params.id});
            res.status(200).json('User deleted');
        } catch (err) {
          next(err);
        }
      } else {
        return next(handleError(403, "You can only update your own account"));
      }
    };

    export const follow = async (req, res, next) => {
        try {
            // Getting the user you want to follow from the ID in the URL
            const user = await User.findById(req.params.id);
            // Getting the current user by request body ID
            const currentUser = await User.findById(req.body.id);

            if(!user.followers.includes(req.body.id)) {
                await user.updateOne({
                // User who is being followed has the followers
                // ID added to their followers array 
                    $push: {followers: req.body.id},
                })
                // User who is following someone has that person's
                // ID added to their following array
                await currentUser.updateOne({
                    $push: {following: req.params.id}
                })
            }
            else {
                res.status(403).json('you already follow this user');
            }
            res.status(200).json("following the user");
        } catch (err) {
          next(err);
        }
      
    };

    export const unFollow = async (req, res, next) => {
      try {
        // Getting the user you want to unfollow from the ID in the URL
        const user = await User.findById(req.params.id);
        // Getting the current user by request body ID
        const currentUser = await User.findById(req.body.id);

        if (currentUser.following.includes(req.params.id)) {
          await user.updateOne({
            // User who is being unfollowed has the followers
            // ID removed their followers array
            $pull: { followers: req.body.id },
          });
          // User who is unfollowing someone has that person's
          // ID removed from their following array
          await currentUser.updateOne({
            $pull: { following: req.params.id },
          });
        } else {
          res.status(403).json("you are not following this user");
        }
        res.status(200).json("unfollowed the user");
      } catch (err) {
        next(err);
      }
    };