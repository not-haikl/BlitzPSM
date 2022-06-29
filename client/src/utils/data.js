import yt_icon from "../assets/youtube.png";
import rd_icon from "../assets/reddit.png";
import TestImg from "../assets/test.png";

export const categories = [
  {
    name: 'YouTube',
    image: yt_icon,
  },
  {
    name: 'Reddit',
    image: rd_icon,
  },
  {
    name: 'Native',
    image: TestImg,
  },
];

export const feedQuery = `*[_type == "post" || _type == "youtubePost" || _type == "redditPost" ] | order(_createdAt desc) {
  _type,
  _id,
  category,
  image{
    asset->{
      url
    }
  },
  destination,
  postedBy->{
    _id,
    userName,
    image
  },
  save[]{
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
  },

  title,
  description,
  thumbnail,
  channel,

  image,
  video,
  video_thumbnail,
  subreddit,
  author,
} `;

export const userCreatedPostsQuery = (userId) => {
  const query = `*[ userId == '${userId}' ] | order(_createdAt desc)  {
    _type,
    _id,
    category,
    image{
      asset->{
        url
      }
    },
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },

    title,
    description,
    thumbnail,
    channel,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
    } `;
  return query;
};

export const userSavedPostsQuery = (userId) => {
  const query = `*['${userId}' in save[].userId ] | order(_createdAt desc) {
    _type,
    _id,
    category,
    image{
      asset->{
        url
      }
    },
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },

    title,
    description,
    thumbnail,
    channel,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
  }`;
  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[ title match '${searchTerm}*' || category match '${searchTerm}*' || description match '${searchTerm}*']{
      _type,
    _id,
    category,
    image{
      asset->{
        url
      }
    },
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },

    title,
    description,
    thumbnail,
    channel,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
  }`;
  return query;
};

export const categoryQuery = (categoryTerm) => {
  const query = `*[_type match '${categoryTerm}*' || category match '${categoryTerm}']{
      _type,
    _id,
    category,
    image{
      asset->{
        url
      }
    },
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },

    title,
    description,
    thumbnail,
    channel,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
  }`;
  return query;
};

export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`;
    return query;
};

export const postDetailQuery = (postId) => {
  const query = `*[_id == '${postId}'] {
    _type,
    _id,
    title,
    description,
    destination,
    category,
    image{
      asset->{
        url
      }
    },
    userId,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
    vid_id,
    thumbnail,
    channel,
    channelId,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
  }`;
  return query;
};

export const postDetailMorePostQuery = (post) => {
  const query = `*[_type == '${post._type}' || category == '${post.category}' && _id != '${post._id}' ]{
    _type,
    category,
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
    title,
    description,
    thumbnail,
    channel,

    image,
    video,
    video_thumbnail,
    subreddit,
    author,
  }`;
  return query;
};

