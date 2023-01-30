import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostAuthor } from "../PostAuthor";
import { selectPostById } from "../Posts/slicePosts";

export const SinglePostPage = ({ location, match }) => {
  const { postId } = match.params;
  console.log(match, location);

  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user} />{" "}
        <Link to={`/posts/${postId}/edit`}>Edit</Link>
      </article>
    </section>
  );
};
