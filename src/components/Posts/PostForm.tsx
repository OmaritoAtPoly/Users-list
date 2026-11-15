import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { NewPost } from "../../types";


export interface PostFormProps {
  userId: number;
  onCreate: (post: NewPost) => void;
  loading?: boolean;
}

export const PostForm = ({
  userId,
  onCreate,
  loading = false,
}: PostFormProps) => {
  const [form, setForm] = useState<{ title: string; body: string }>({
    title: "",
    body: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isValid = form.title.trim() && form.body.trim();

  const titleError = submitted && !form.title.trim()
    ? "Title is required"
    : null;
  const bodyError = submitted && !form.body.trim()
    ? "Body is required"
    : null;

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, body: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    onCreate({ userId, title: form.title.trim(), body: form.body.trim() });
    setForm({ title: "", body: "" });
    setSubmitted(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={form.title}
          onChange={handleTitleChange}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
        />
        {titleError && <span id="title-error">{titleError}</span>}
      </div>
      <div>
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          value={form.body}
          onChange={handleBodyChange}
          aria-invalid={!!bodyError}
          aria-describedby={bodyError ? "body-error" : undefined}
        />
        {bodyError && <span id="body-error">{bodyError}</span>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create post"}
      </button>
    </form>
  );
};

export default PostForm;
