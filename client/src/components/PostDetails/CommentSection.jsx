import React,{ useState,useRef } from 'react';
import {Typography, TextField, Button} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {commentPost} from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({post}) => {
    const dispatch = useDispatch()
    const classes = useStyles();
    const [comments, setComments] = useState([post?.comments]);
    const [comment, setComment] = useState("");
    const user = JSON.parse(localStorage.getItem('profile'));
    const commentsRef = useRef();

    const handleClick = async() => {
        const finalComment = `${user.result.name}: ${comment}`;
        const newComments = await dispatch(commentPost(finalComment,post._id));
        setComments(newComments);
        setComment('');
        commentsRef.current.scrollIntoView({behavior: 'smooth'});
    };
    return (
       <div>
           <div className={classes.commentOuterContainer}>
                <div className={classes.commentInnerContainer}>
                    <Typography gutterBottom variant='h6'>Comments</Typography>
                    {comments.map((c,i) => (
                        {c}
                    ))}
                    <div ref={commentsRef} />
                </div>
                {user?.result?.name && 
                    <div style={{width: '70%'}}>
                        <Typography gutterBottom variant='h6'>Write a Comment</Typography>
                        <TextField
                            fullWidth
                            rows={4}
                            variant='outlined'
                            label="Comment"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button style={{marginTop: '10px'}} fullWIdth disabled={!comment} variant='contained' color='primary' onClick={handleClick}>
                            Comment
                        </Button>
                    </div> 
                }              
           </div>
       </div>
    )
}

export default CommentSection
/*
<strong>{c.split(': ')[0]}</strong>
                            {c.split(":")[1]}
                            */
