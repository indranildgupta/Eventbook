import PostMessage from "../models/postMessage.js";
import mongoose from 'mongoose';
import express from 'express';

const router = express.Router();

export const getPosts = async function(req, res){
    const {page} = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page)-1)*LIMIT; // get starting index of posts in every page

        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});

    }catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getPost = async function(req, res){
    const {id} = req.params;
    try{
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message: err});
    }
}

export const getPostsBySearch = async function(req, res){
    const { searchQuery,tags } = req.query;
    try {
        const title = new RegExp(searchQuery,'i');
        const posts = await PostMessage.find({ $or: [{title}, {tags: { $in: tags.split(',')} }] });

        res.json({data: posts});
        
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

export const createPost= async function(req, res){
    const post = req.body;

    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() });
    try{
        await newPost.save();
        res.status(201).json(newPost);
    }catch(err){
        res.status(409).json({message: err.message});
    }
}
export const updatePost = async function(req, res){
    const { id: _id } = req.params;  //object desructuring
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('No post with that id');
    } 
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post,_id},{new:true});

    res.json(updatedPost);
}

export const deletePost = async function(req, res){
    const { id} = req.params;  //object desructuring
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    } 

    await PostMessage.findByIdAndRemove(id);

    res.json({message: 'Post Deleted Sucesfully'});
}

export const likePost = async function(req, res){
    const {id} = req.params;  //object desructuring

    if(!req.userId) 
        return  res.json({message: 'Unauthenticated'});

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    } 

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index==-1){ //likes the post
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter( (id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id,post, {new: true});

    res.json(updatedPost);
}

export const commentPost = async function(req, res){
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}

//export default router;