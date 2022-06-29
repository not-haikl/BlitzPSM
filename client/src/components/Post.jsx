import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';
import youtube from "../assets/youtube.png";
import reddit from "../assets/reddit.png";
import ytAvatar from "../assets/youtube_avatar.png";
import rdAvatar from "../assets/reddit_avatar.png";

import { client, urlFor } from '../client';

const Post = ( { post } ) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  
  const user = fetchUser();
  const { _id, _type } = post;
  //console.log(_id); 

  let alreadySaved = post?.save?.filter((item) => item?.postedBy?._id === user?.sub);

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePost = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePost = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  const handleRedditPost = (title, image, video, video_thumbnail, description) => {
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
        <>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="py-4">{description}</p>
        </>
      )
    }
  }

  const handleNativePost = (title, image, description) => {
    if(image !== null){
      return(
        <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />
      )
    }
    else{
      return(
        <>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="py-4">{description}</p>
        </>
      )
    }
  }

  if(_type == "youtubePost"){
    const {title, thumbnail, destination, channel} = post;
    
    return (
      <div className="m-2 p-2 bg-neutral-800 rounded-lg">
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/post-detail/${_id}`)}
          className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
          <img className="rounded-lg w-full " src={thumbnail} alt="user-post" />

          {postHovered && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
              style={{ height: '100%' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <a
                    href={`${thumbnail}?dl=`}
                    download
                    onClick={(e) => { e.stopPropagation(); }}
                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <MdDownloadForOffline/>
                  </a>
                </div>
                {alreadySaved?.length !== 0 ? (
                  <button type="button" className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                    {post?.save?.length}  Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePost(_id);
                    }}
                    type="button"
                    className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    {post?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                  </button>
                )}
              </div>
              <div className=" flex justify-between items-center gap-2 w-full">
                {destination?.slice(8).length > 0 ? (
                  <a
                    href={destination}
                    target="_blank"
                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                    rel="noreferrer"
                  >
                    {' '}
                    <BsFillArrowUpRightCircleFill />
                    {destination?.slice(8, 17)}...
                  </a>
                  ) : undefined}
                
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Link to={`/post-detail/${_id}`} className="gap-3 mt-3">
            <div className="mt-3 justify-left">
              <h3>{title?.slice(0, 48)} . . .</h3>
            </div>
            <div className='flex justify-between mt-3'>
              <a className='flex'>
                <img
                  className="w-6 h-6 rounded-full ml-2"
                  src={ytAvatar}
                  alt="user-profile"
                />
                <p className="font-light capitalize ml-2">{channel?.slice(0, 20)}</p>
              </a>
              <img
                className="w-6 h-6 rounded-full "
                src={youtube}
                alt="user-profile"
              />
            </div>
          </Link>
        </div>
      </div>
    )
  }
  
  if(_type  == "redditPost"){
    const {title, description, image, video, video_thumbnail, destination, subreddit, author} = post;
    
    return (
      <div className="m-2 px-2 py-3 bg-neutral-800 rounded-lg">
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/post-detail/${_id}`)}
          className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
          
          { 
          handleRedditPost(title, image, video, video_thumbnail, description)
          }

          {(postHovered && image !== null && video_thumbnail !== null) && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
              style={{ height: '100%' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <a
                    href={`${video_thumbnail}?dl=`}
                    download
                    onClick={(e) => { e.stopPropagation(); }}
                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <MdDownloadForOffline/>
                  </a>
                </div>
                {alreadySaved?.length !== 0 ? (
                  <button type="button" className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                    {post?.save?.length}  Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePost(_id);
                    }}
                    type="button"
                    className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    {post?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                  </button>
                )}
              </div>
              <div className=" flex justify-between items-center gap-2 w-full">
                {destination?.slice(8).length > 0 ? (
                  <a
                    href={destination}
                    target="_blank"
                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                    rel="noreferrer"
                  >
                    {' '}
                    <BsFillArrowUpRightCircleFill />
                    {destination?.slice(8, 17)}...
                  </a>
                  ) : undefined}
                
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Link to={`/post-detail/${_id}`} className="gap-3 mt-3">
              <div className="mt-3 justify-left">
                <h3>{title}</h3>
              </div>
              <div className='flex justify-between mt-3'>
                <a className='flex'>
                  From: 
                  <img
                    className="w-6 h-6 rounded-full ml-2"
                    src={rdAvatar}
                    alt="user-profile"
                  />
                  <p className="font-light ml-2">{subreddit}</p>
                </a>
                <img
                  className="w-6 h-6 rounded-full "
                  src={reddit}
                  alt="user-profile"
                />
              </div>
            </Link>
        </div>
      </div>
    )
  }

  if(_type  == "post"){
    const { title, image,  _id, description, destination, postedBy } = post;
    
    return (
      <div className="m-2 p-2 bg-neutral-800 rounded-lg">
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/post-detail/${_id}`)}
          className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        > 
          {handleNativePost(title, image, description)}

          {(postHovered && image !== null) && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
              style={{ height: '100%' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <a
                    href={`${image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  ><MdDownloadForOffline/>
                  </a>
                </div>
                {alreadySaved?.length !== 0 ? (
                  <button type="button" className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                    {post?.save?.length}  Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePost(_id);
                    }}
                    type="button"
                    className="bg-green-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    {post?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                  </button>
                )}
              </div>
              <div className=" flex justify-between items-center gap-2 w-full">
                {destination?.slice(8).length > 0 ? (
                  <a
                    href={destination}
                    target="_blank"
                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                    rel="noreferrer"
                  >
                    {' '}
                    <BsFillArrowUpRightCircleFill />
                    {destination?.slice(8, 17)}...
                  </a>
                ) : undefined}
                {
             postedBy?._id === user?.sub && (
             <button
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 deletePost(_id);
               }}
               className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-black opacity-75 hover:opacity-100 outline-none"
             >
               <AiTwotoneDelete />
             </button>
             )
          }
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-3 mt-3 justify-between">
              <a className='flex'>
                <img
                  className="w-6 h-6 rounded-full ml-2"
                  src={postedBy?.image}
                  alt="user-profile"
                />
                <p className="font-light capitalize ml-2">{postedBy?.userName.slice(0, 20)}</p>
              </a>
              <>N</>
          </Link>
        </div>
      </div>
    )
  }
}

export default Post