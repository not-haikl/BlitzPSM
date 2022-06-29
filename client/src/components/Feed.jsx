import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, categoryQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';


const Feed = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  
  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      const query = categoryQuery(categoryId);
      
      client.fetch(query).then((data) => {
        setPosts(data);
        setLoading(false);
      });
    } 
    
    else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return (
      <Spinner message={`We are adding new ideas to your feed!`} />
    );
  }

  return (
    <div>
      {posts && (
        <MasonryLayout posts={posts} />
      )}
    </div>
  )
}

export default Feed