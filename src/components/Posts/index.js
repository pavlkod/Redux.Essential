import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReactionButtons } from "../Emoji";
import { PostAuthor } from "../PostAuthor";
import { Spinner } from "../Spinner";
import { TimeAgo } from "../TimeAgo";
import {
  fetchPosts,
  selectPostById,
  selectPostIds,
  selectPosts
} from "./slicePosts";

const PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      {Date.now()}
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  );
};

export default function Posts() {
  const posts = useSelector(selectPostIds);
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (postStatus === "idle") dispatch(fetchPosts());
  }, [postStatus, dispatch]);

  let content;

  console.log(posts);

  if (postStatus === "loading") {
    content = <Spinner text="Loading..." />;
  } else if (postStatus === "succeeded") {
    content = posts.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
}
