import React from 'react'
import classes from './Comment.module.css'
import { useState } from 'react'

function Comment(props) {
    const [comment, setComment] = useState('');

    const commentChangeHandler = (e) => {
        setComment(e.target.value);
    }

    const commentSubmitHandler = () => {
        if(comment.length > 4) {
          props.onCommentSubmit(comment);
          setComment('');
        }
        console.log('Your comment is too short');
    }
  return (
    <>
  <h3 className={classes.heading}>Add A Comment Below</h3>
  <div className={classes.container}>
    <form>
      <div className="form-group">
        <textarea className={classes['form-control']} minLength={5} onChange={commentChangeHandler} value={comment} rows="3" placeholder="Enter your comment here..."></textarea>
      </div>
      <button type='button' onClick={commentSubmitHandler} className={`${classes.btn} ${classes['btn-primary']}`}>
        Add Comment
      </button>
    </form>
    <div className="button-group pull-right">
      {/* <p className="counter">250</p> */}
    </div>
    {console.log(props.loadedComments)}
    <ul className={classes.posts}>
        {props.loadedComments ? props.loadedComments.map((comment, index) => (
          <li key={index}>
            {comment}
          </li>
        )): ''}
    </ul>
  </div>
</>
  )
}

export default Comment