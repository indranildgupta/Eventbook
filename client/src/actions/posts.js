import * as api from '../api';
import {FETCH_ALL,CREATE,UPDATE,DELETE,LIKE,FETCH_BY_SEARCH,START_LOADING, END_LOADING,FETCH_POST,COMMENT} from '../constants/actionTypes'


export const getPosts = (page) => async(dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data} = await api.fetchPosts(page);

        dispatch({type: FETCH_ALL, payload: data});
        dispatch({type: END_LOADING});
    }catch(err) {
        console.log(err.message);
    }
};

export const getPost = (id) => async(dispatch) => {  //postdetails page
    try {
        dispatch({type: START_LOADING});
        const {data} = await api.fetchPost(id);

        dispatch({type: FETCH_POST, payload: data});
        dispatch({type: END_LOADING});
    }catch(err) {
        console.log(err.message);
    }
};

export const getPostsBySearch = (searchQuery) => async(dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsBySerch(searchQuery);
        //console.log(data);
        dispatch({type: FETCH_BY_SEARCH, payload: data});
        dispatch({type: END_LOADING});
    }catch(err) {
        console.log(err);
    }
};

export const createPost = (post,History) => async(dispatch) => {
    try{
        dispatch({type: START_LOADING});
        const { data} = await api.createPost(post);
        
        History.push(`/posts`);
        dispatch({type: CREATE, payload: data});
  
    }catch(err){
        console.log(err.message); 
    }
};

export const updatePost = (id,post) => async(dispatch) => {
    try{
        const {data} = await api.updatePost(id, post);
        dispatch({type: UPDATE, payload: data});
    }catch(err){
        console.log(err.message);
    }
};

export const deletePost = (id) => async(dispatch) => {
    try{
        await api.deletePost(id);
        dispatch({type: DELETE, payload: id});
    }catch(err){
        console.log(err);
    }
};

export const likePost = (id) => async(dispatch) => {
    try{
        const {data} = await api.likePost(id);
        dispatch({type: LIKE, payload: data});
    }catch(err){
        console.log(err);
    }
};
export const commentPost = (value,id) => async(dispatch) => {
    try{
        const {data} = await api.comment(value,id);
        //console.log(data);
        dispatch({type: COMMENT, payload:data});
        return data.comments;
    }catch(err){
        console.log(err);
    }
};