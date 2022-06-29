import React from 'react'
import Masonry from 'react-masonry-css';
import Post from './Post';

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ posts }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
      {posts?.map((posts) => <Post key={posts._id} post={posts} className="w-max" />)}
    </Masonry>
  )
}

export default MasonryLayout