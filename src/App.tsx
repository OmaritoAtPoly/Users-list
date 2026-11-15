import { useMemo, useState } from "react";
import type { NewPost, Post, User } from "./types";

import SearchBar from "./components/SearchBar";
import Status from "./components/Status";
import withErrorBoundary from "./components/withErrorBoundary";
import UserList from "./components/Users/UserList";
import PostList from "./components/Posts/PostList";
import PostForm from "./components/Posts/PostForm";
import { useGet, usePost } from "./hooks/useAxios";
import "./App.css";
const SafePostList = withErrorBoundary(PostList);
const SafePostForm = withErrorBoundary(PostForm);

function App() {
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    reload: reloadUsers,
  } = useGet<User[]>("/users");

  const postsUrl = selectedUserId ? `/posts?userId=${selectedUserId}` : "";
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
  } = useGet<Post[]>(postsUrl);

  const {
    post: createPost,
    loading: creating,
    error: createError,
  } = usePost<Post>();

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users ?? [];
    const q = query.toLowerCase();
    return (users ?? []).filter((user) => user.name.toLowerCase().includes(q));
  }, [query, users]);

  const handleCreate = (newPost: NewPost) => {
    createPost("/posts", newPost).then((created) => {
      if (created) {
        setSelectedUserId(created.userId);
      }
    });
  };

  return (
    <div className="main-app-container">
      <aside className="app-aside">
        <h2>Users</h2>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search users..."
        />
        <Status
          loading={usersLoading}
          error={usersError}
          label="Loading users"
          onRetry={reloadUsers}
        />
        <UserList
          users={filteredUsers}
          onSelect={(user) => setSelectedUserId(user.id)}
          selectedId={selectedUserId}
        />
      </aside>

      <main className="app-main">
        {selectedUserId ? (
          <div className="post-wrapper-container">
            <Status
              loading={postsLoading || creating}
              error={postsError ?? createError}
              label="Loading posts"
              onRetry={reloadPosts}
            />
            <SafePostList posts={posts ?? []} />
            <hr />
            <SafePostForm
              userId={selectedUserId}
              onCreate={handleCreate}
              loading={creating}
            />
            {createError && <p className="app-error">{createError}</p>}
          </div>
        ) : (
          <p className="app-empty">Select a user to see their posts.</p>
        )}
      </main>
    </div>
  );
}

export default App;
