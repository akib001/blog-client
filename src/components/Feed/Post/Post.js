import React, { useEffect } from 'react';
import Button from '../../Button/Button';
import Comment from './Comment';
import './Post.css';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';
import { useState } from 'react';

const post = (props) => {
  const [postData, setPostData] = useState(props.postData);

  const [upvoteActive, setUpvoteActive] = useState('');
  const [downvoteActive, setDownvoteActive] = useState('');

  const [upvote, setUpvote] = useState(props.postData.upvote);
  const [downvote, setDownvote] = useState(props.postData.downvote);

  useEffect(() => {
    if(props.postData.votedUsers) {
      props.postData.votedUsers.forEach((element) => {
        if (element.userId === props.userId) {
          if(element.voteType) {
            if(element.voteType === 'upvote') {
              setUpvoteActive(true);
            } else {
              setDownvoteActive(true);
            }
          }
          return;
        }
       
      })
    } 

  }, []);

  const commentSubmitHandler = (comment) => {
    fetch('http://localhost:8080/feed/post-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        postId: props.id,
        comment: comment,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then((resData) => {
        fetch('http://localhost:8080/feed/post/' + props.id, {
          headers: {
            Authorization: 'Bearer ' + props.token,
          },
        })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error('Failed to fetch status');
            }
            return res.json();
          })
          .then((resData) => {
            setPostData({ ...postData, comments: resData.post.comments });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const upvoteHandler = () => {
      console.log('upvote handler running')
      fetch('http://localhost:8080/feed/post/upvote', {
        method: 'POST',
        body: JSON.stringify({
          postId: props.id,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('Failed to update vote');
          }
          return res.json();
        })
        .then((resData) => {
            setUpvote(resData.upvote);
            setUpvoteActive(!resData.voteRemove);
            setDownvoteActive(false);
            setDownvote(resData.downvote);
            console.log(resData);
        })
        .catch((err) => {
          console.log(err);
        });
  };


  const downvoteHandler = () => {
      fetch('http://localhost:8080/feed/post/downvote', {
        method: 'POST',
        body: JSON.stringify({
          postId: props.id,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error('Failed to update vote');
          }
          return res.json();
        })
        .then((resData) => {
            setDownvote(resData.downvote);
            setDownvoteActive(!resData.voteRemove);
            setUpvote(resData.upvote);
            setUpvoteActive(false);
            console.log(resData);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  
  return (
    <article className="post">
      <header className="post__header">
        <h3 className="post__meta">
          Posted {props.author} on {props.date}
        </h3>
        <h1 className="post__title">{props.title}</h1>
      </header>
      {/* <div className="post__image">
      <Image imageUrl={props.image} contain />
    </div> */}
      <div className="post__content">{props.content}</div>
      <div className="post__actions">
        <div>
          <button
            className={upvoteActive ? 'btn vote active' : 'btn vote'}
            onClick={upvoteHandler}
          >
            <BiUpvote style={{ fontSize: '18px' }} />
            <span>{upvote}</span>
          </button>
          <button className={downvoteActive ? 'btn vote active' : 'btn vote'}
          onClick={downvoteHandler}
          >
            <BiDownvote style={{ fontSize: '18px' }} />
            <span>{downvote}</span>
          </button>

          <button className="btn">
            <FaRegCommentAlt style={{ fontSize: '18px' }} />
            <span> {postData.comments ? postData.comments.length : 0}</span>
          </button>
        </div>
        <div>
          <Button mode="flat" link={props.id}>
            View
          </Button>
          <Button mode="flat" onClick={props.onStartEdit}>
            Edit
          </Button>
          <Button mode="flat" design="danger" onClick={props.onDelete}>
            Delete
          </Button>
        </div>
      </div>
      <Comment
        onCommentSubmit={commentSubmitHandler}
        loadedComments={postData.comments}
      />
    </article>
  );
};

export default post;
