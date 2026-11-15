import type { Post } from "../../types";
import "../styles/PostList.css";

export interface PostListProps {
  posts: Post[];
}

export const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <ul className="posts-container">
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
