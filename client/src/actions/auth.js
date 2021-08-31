import * as api from '../api';
import {AUTH} from '../constants/actionTypes'

export const signin = (formData,history) => async(dispatch) => { 
    try{
        //login
        const {data} = await api.signIn(formData);
        //console.log("API called")
        dispatch({ type: AUTH,data});
        history.push('/');
    }catch(err){
        console.log(err);
    }
};

export const signup = (formData,history) => async(dispatch) => { 
    try{
        //sign up
        const {data} = await api.signUp(formData);
        dispatch({ type: AUTH,data});
        history.push('/');
    }catch(err){
        console.log(err);
    }
};