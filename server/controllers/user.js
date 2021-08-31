import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const signin = async function(req,res) {
    const { email,password } = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message: "User doesn't exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            res.status(400).json({message: "Incorrect Password"});
        }
        const token = jwt.sign({email:existingUser.email, id: existingUser._id},'test',{expiresIn: "1h"});
        
        
        res.status(200).json({result: existingUser,token});

    }catch(err){
        console.log(err.message);
        res.status(500).json({message: "Something Went wrong"});
    }
};

export const signup = async function(req,res) {
    const { email,password,confirmPassword,firstName,lastName } = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({message: "User already exist"});
        }
        if(password !== confirmPassword){
            res.status(400).json({message: "Password don't match."});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const result = await User.create({email,password: hashedPassword, name: `${firstName} ${lastName}`});

        const token = jwt.sign({email:result.email, id: result._id},'test',{expiresIn: "1h"});

        res.status(200).json({result,token});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Something Went wrong"});
    }
};



