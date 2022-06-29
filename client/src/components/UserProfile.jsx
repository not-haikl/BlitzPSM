import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';

import { userCreatedPostsQuery, userSavedPostsQuery, userQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const YT_TOPVIDS = 'https://www.googleapis.com/youtube/v3/videos';
const YT_API_KEY = 'INSERT_YOUTUBE_API_CLIENT_KEY';
const YT_MAXRESULT = '10';

const RD_SUBREDDIT = 'INSERT_REDDIT_API_KEY';
const RD_MAXRESULT = '10';

const activeBtnStyles = 'text-xl underline underline-offset-8 decoration-green-600 decoration-4 text-white px-6 py-3 m-8';
const notActiveBtnStyles = 'text-lg bg-primary text-white px-6 py-3 m-8 ';

const UserProfile = () => {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [articles, setArticles] = useState([]);
  
  const [activeBtn, setActiveBtn] = useState('created');
  const [text, setText] = useState('Created');
  
  const { userId } = useParams();
  const navigate = useNavigate();

  async function fetchYTdata() {
    const res = await fetch(`${YT_TOPVIDS}?part=snippet&chart=mostPopular&maxResults=${YT_MAXRESULT}&key=${YT_API_KEY}`);
    const ytData = await res.json();
    
    { ytData.items.map((item) => {
      const {id, snippet = {} } = item;
      const {title, description, thumbnails, channelTitle, channelId = {}} = snippet;
      
      const doc = {
        vid_id: id,
        _type: 'youtubePost',
        title,
        description,
        thumbnail: `${thumbnails.medium.url}`,
        destination: `https://www.youtube.com/watch?v=${id}`,
        channel: channelTitle,
        channelId,
        category:'YouTube'
      };
      //console.log(ytData);
      //console.log(doc);
      client.create(doc);
    })}
  }

  async function fetchRedditData() {
    fetch(`https://www.reddit.com/r/${RD_SUBREDDIT}.json?limit=${RD_MAXRESULT}`).then(
      res => {
        if (res.status !== 200) {
          console.warn("API Error");
          return;
        }
        res.json().then(data => {
          if (data != null){
            setArticles(data.data.children);
          }
        });
      }
    )
    
    if(articles != null){
      articles.map((article) => {
        const { id, title, selftext, url, media, permalink, subreddit_name_prefixed, thumbnail, author } = article.data;
        
        if(media != null){
          var fallback_url = media.reddit_video.fallback_url;
          url = null;
        }

        const doc = {
          _id: id,
          _type: 'redditPost',
          title,
          description: selftext,
          image: url,
          video: fallback_url,
          video_thumbnail: thumbnail,
          destination: `https://www.reddit.com/${permalink}`,
          subreddit: subreddit_name_prefixed,
          author,
          category: 'Reddit'
        };
        //console.log(doc);
        //console.log(article.data);
        client.create(doc);
      })
    }
  }

  function handleLogOut() {
    /*client
      .delete({query: '*[_type == "post"][12]'})
      .then(() => {
        console.log('document deleted')
      })
      .catch((err) => {
        console.error('Delete failed: ', err.message)
      })*/
  }

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPostsQuery = userCreatedPostsQuery(userId);

      client.fetch(createdPostsQuery).then((data) => {
        setPosts(data);
      });
    } else {
      const savedPostsQuery = userSavedPostsQuery(userId);

      client.fetch(savedPostsQuery).then((data) => {
        setPosts(data);
      });
    }
  }, [text, userId]);
  
  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
              <img
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover "
                src={user.image}
                alt="user-pic"
              />
          </div>
          <div className='flex justify-center items-center mb-14'>
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <button
                  type="button"
                  className="flex mt-2 ml-4 p-2 rounded-full cursor-pointer outline-none shadow-md justify-center items-center"
                  onClick={(e) => { navigate('/login', { replace: false })}}
                >
                  <AiOutlineLogout className='text-red-500' fontSize={28}/>
                  <p className='px-2 underline underline-offset-8 decoration-red-500 decoration-1 text-red-400'>Log out</p>
            </button>
          </div>
          
        </div>
        <div className="text-center mb-8 justify-center items-center">
          <button
            type="button"
            onClick={fetchYTdata}
            className="bg-red-500 text-white font-medium p-3 m-2 rounded-full w-56 outline-none"
          >
            Connect To Youtube
          </button>
          
          <button
            type="button"
            onClick={fetchRedditData}
            className="bg-orange-500 text-white font-medium p-3 m-2 rounded-full w-56 outline-none"
          >
            Connect To Reddit
          </button>
          <button
            type="button"
            onClick={(e) => { }}
            className="bg-slate-500 text-white font-medium p-3 m-2 rounded-full w-56 outline-none"
          >
            Coming Soon . . .
          </button>

          
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={(e) => {
              setText("Created");
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Posts Created By {user.userName}
          </button>
            
          <button
            type="button"
            onClick={(e) => {
              setText("Saved");
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Posts Saved By {user.userName}
          </button>
        </div>
        {posts?.length ? (
          <div className="px-2">
          <MasonryLayout posts={posts} />
        </div>
        ): (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Posts Here . . .
          </div>
        )
        }
      </div>
    </div>
  )
}

export default UserProfile