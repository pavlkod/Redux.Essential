import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUserById } from "../User/sliceUser";
import { selectPostsByUserId, selectPosts } from "../Posts/slicePosts";

export const UserPage = ({ match }) => {
  const { userId } = match.params;

  const user = useSelector((state) => selectUserById(state, userId));
  const postsForUser2 = useSelector((state) =>
    selectPostsByUserId(state, userId)
  );
  const postsForUser = useSelector((state) => {
    const posts = selectPosts(state);
    return posts.filter((post) => post.user === userId);
  });

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      {Date.now()}
      <ul>{postTitles}</ul>
    </section>
  );
};
