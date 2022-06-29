import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReadMoreReact from 'read-more-react';

import { client, urlFor } from '../client';
import { postDetailMorePostQuery, postDetailQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

import youtube from "../assets/youtube.png";
import reddit from "../assets/reddit.png";
import ytAvatar from "../assets/youtube_avatar.png";
import rdAvatar from "../assets/reddit_avatar.png";

const PostDetail = ({ user }) => {
  const [posts, setPosts] = useState();
  const [postDetail, setPostDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { postId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPostDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };
  
  const fetchPostDetails = () => {
    const query = postDetailQuery(postId);
    //console.log(query);
    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPostDetail(data[0]);
        console.log(data);
        
        if (data[0]) {
          const query1 = postDetailMorePostQuery(data[0]);
          
          client.fetch(query1).then((res) => {
            setPosts(res);
          });
        }

        //console.log(postDetail);
      });
    }
  };

  const handleRedditPost = (image, video, video_thumbnail, description) => {
    if(image !== null){
      return(
        <img className="rounded-lg w-full" src={image} alt="user-post" />
      )
    }
    if(video != null && video_thumbnail !== null) {
      return(
        <img className="rounded-lg w-full" src={video_thumbnail} alt="user-post" />
      )
    }
    else{
      return(
        <p>{description}</p>
      )
    }
  }

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  if (!postDetail) {
    return (
      <Spinner message="Loading Posts . . ." />
    );
  }
  
  if(postDetail?._type == "youtubePost"){
    return(
      <>
        <div className="flex xl:flex-row flex-col m-auto bg-neutral-900" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial max-w-3xl">
            <iframe width="720" height="405" src={`https://www.youtube.com/embed/${postDetail?.vid_id}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-left mb-4">
              <img src={youtube} className="w-10 h-10 mr-4 rounded-full" alt="user-profile" />
              <a href={postDetail.destination} target="_blank" rel="noreferrer">
                    {postDetail.destination?.slice(8)}
              </a>
              
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {postDetail.title}
              </h1>
              <p className="mt-3">
                <ReadMoreReact text={postDetail.description}
                  min={100}
                  ideal={120}
                  max={200}
                  readMoreText="Click Here to Read More."
                  className="text-green-500"
                />
              </p>
            </div>
        
            <a href={`https://www.youtube.com/channel/${postDetail?.channelId}`} target="_blank" className="flex gap-2 mt-5 items-center bg-neutral-900 rounded-lg">
                  <>By:</>
                  <img src={ytAvatar} className="w-10 h-10 rounded-full" alt="user-profile" />
                  <p className="font-bold">{postDetail?.channel}</p>
            </a>
            
            <h2 className="mt-5 text-2xl">Comments</h2>
            
            <div className="max-h-370 overflow-y-auto">
              {postDetail?.comments?.map((item) => (
                <div className="flex gap-2 mt-5 items-center bg-neutral-700 rounded-xl p-3" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col pl-4">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 bg-neutral-300 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting Comment...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        {posts?.length > 0 && (
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              Similar Posts
            </h2>
          )}
          {posts ? (
            <MasonryLayout posts={posts} />
          ) : (
            <Spinner message="Loading more posts" />
          )}
      </>
    )
  }
  if(postDetail?._type == "redditPost"){
    return(
      <>
        <div className="flex xl:flex-row flex-col m-auto bg-neutral-900" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial max-w-3xl">
            {handleRedditPost(postDetail?.image, postDetail?.video, postDetail?.video_thumbnail, postDetail?.description)}
          </div>
          
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center mb-4 justify-left">
              <img src={reddit} className="w-10 h-10 mr-4 rounded-full" alt="user-profile" />
              <a href={postDetail.destination} target="_blank" rel="noreferrer">
                    {postDetail.destination?.slice(8)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {postDetail.title}
              </h1>
              <p className="mt-3">
                <ReadMoreReact text={postDetail.description}
                  min={100}
                  ideal={120}
                  max={200}
                  readMoreText="Click Here to Read More."
                  className="text-green-500"
                />
              </p>
            </div>
            
            <a href={`https://www.reddit.com/user/${postDetail?.author}`} target="_blank" className="flex gap-2 mt-5 items-center bg-neutral-900 rounded-lg ">
                  <>By:</>
                  <img src={rdAvatar} className="w-10 h-10 rounded-full" alt="user-profile" />
                  <p className="font-bold">{postDetail?.author}</p>
            </a>
            
            <h2 className="mt-5 text-2xl">Comments</h2>
            
            <div className="max-h-370 overflow-y-auto">
              {postDetail?.comments?.map((item) => (
                <div className="flex gap-2 mt-5 items-center bg-neutral-700 rounded-xl p-3" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col pl-4">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 bg-neutral-300 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting Comment...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        {posts?.length > 0 && (
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              Similar Posts
            </h2>
          )}
          {posts ? (
            <MasonryLayout posts={posts} />
          ) : (
            <Spinner message="Loading more posts" />
          )}
      </>
    )
  }
  if(postDetail?._type == "post"){
    return(
      <>
        <div className="flex xl:flex-row flex-col m-auto bg-neutral-900" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial max-w-3xl">
            <img
              className="rounded-t-3xl rounded-b-lg object"
              src={(postDetail?.image && urlFor(postDetail?.image).url())}
              alt="user-post"
            />
          </div>
          
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-left mb-4">
              
              <a className="mr-4 bg-white text-black px-3 py-2 rounded-full">N</a>
              <a href={postDetail.destination} target="_blank" rel="noreferrer">
                    {postDetail.destination?.slice(8)}
              </a>
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {postDetail.title}
              </h1>
              <p className="mt-3">
                <ReadMoreReact text={postDetail.description}
                  min={100}
                  ideal={120}
                  max={200}
                  readMoreText="Click Here to Read More."
                  className="text-green-500"
                />
              </p>
            </div>

            <Link to={`/user-profile/${postDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-neutral-900 rounded-lg ">
                  <>By:</>
                  <img src={postDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
                  <p className="font-bold">{postDetail?.postedBy.userName}</p>
            </Link>
            
            <h2 className="mt-5 text-2xl">Comments</h2>
            
            <div className="max-h-370 overflow-y-auto">
              {postDetail?.comments?.map((item) => (
                <div className="flex gap-2 mt-5 items-center bg-neutral-700 rounded-xl p-3" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col pl-4">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 bg-neutral-300 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-green-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Posting Comment...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
        {posts?.length > 0 && (
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              Similar Posts
            </h2>
          )}
          {posts ? (
            <MasonryLayout posts={posts} />
          ) : (
            <Spinner message="Loading more posts" />
          )}
      </>
    )
  }
}

export default PostDetail
