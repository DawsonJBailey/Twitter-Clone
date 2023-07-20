import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {handleError} from "../error.js"

export const signup= async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        // Creating a new user based on the schema in User.js
        // req.body will contain username and email and password is encrypted
        const newUser = new User({...req.body, password: hash});
        await newUser.save();
        // Using _id here because that's the unique id created by MongoDB
        const token = jwt.sign({id: newUser._id}, process.env.JWT);
        // Taking the password out and only sending the other data
        // for better security
        const {password, ...othersData} = newUser._doc;
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json(othersData);
    }catch(err){
        next(err);
    }
}

export const signin = async (req, res, next) => {
  try {
    // Finding the user in the database by username
    const user = await User.findOne({username: req.body.username})

    if(!user) return next(handleError(404, 'User not found'))

    const isCorrect = await bcrypt.compare(req.body.password, user.password)
    // Checking if password is correct
    if(!isCorrect) return next(handleError(400, 'Wrong password'));

    const token = jwt.sign({id: user._id}, process.env.JWT);
    const {password, ...othersData} = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(othersData);

  } catch (err) {
    next(err);
  }
};