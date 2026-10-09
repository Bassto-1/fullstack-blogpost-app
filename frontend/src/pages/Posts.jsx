import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // GET POSTS
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to get posts");
        }

        setPosts(data.posts);
      })
      .catch((error) => {
        console.error("Error getting posts:", error);
        showMessage(error.message || "Unable to connect to server");
      })
      .finally(() => setLoading(false));
  }, [API_URL, navigate]);

  // CREATE POST
  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      showMessage("Please fill in title and content");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setPosts((previousPosts) => [...previousPosts, data.post]);
      setTitle("");
      setContent("");
      showMessage("Post created successfully");
    } catch (error) {
      console.error("Create post error:", error);
      showMessage(error.message || "Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE POST
  const handleDeletePost = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== id)
      );

      showMessage("Post deleted successfully");
    } catch (error) {
      console.error("Delete post error:", error);
      showMessage(error.message || "Unable to connect to server");
    } finally {
      setDeletingId(null);
    }
  };

  // UPDATE POST
  const handleUpdatePost = async (id) => {
    if (!title.trim() || !content.trim()) {
      showMessage("Please fill in title and content");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === id ? data.post : post
        )
      );

      setTitle("");
      setContent("");
      setEditingId(null);
      showMessage("Post updated successfully");
    } catch (error) {
      console.error("Update post error:", error);
      showMessage(error.message || "Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="posts-page">
      <div className="posts-container">
        <div className="posts-header">
          <h1>My Blog</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="form-box">
          <h2>{editingId ? "Edit Post" : "Create Post"}</h2>

          {message && <p>{message}</p>}

          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            className="create-button"
            onClick={() =>
              editingId
                ? handleUpdatePost(editingId)
                : handleCreatePost()
            }
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editingId
                ? "Update Post"
                : "Create Post"}
          </button>
        </div>

        <div className="posts-list">
          <h2>My Posts</h2>

          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>You don't have any posts yet.</p>
          ) : (
            posts.map((post) => (
              <div className="post" key={post._id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                <button
                  className="edit-button"
                  onClick={() => {
                    setTitle(post.title);
                    setContent(post.content);
                    setEditingId(post._id);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDeletePost(post._id)}
                  disabled={deletingId === post._id}
                >
                  {deletingId === post._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;