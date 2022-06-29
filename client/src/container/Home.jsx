import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import {Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import { client } from '../client';
import Posts from './Posts';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState();
  const scrollRef = useRef(null);
  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });
  
  return (
    <div className="flex bg-neutral-900 md:flex-row flex-col h-screen transition-height duration-75 ease-in-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user}/>
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={32} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to={`user-profile/${user?._id}`}>
              <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full " />
              
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in"> 
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/*" element={<Posts user={user && user} />} />
          </Routes>
        </div>
    </div>
  )
}

export default Home