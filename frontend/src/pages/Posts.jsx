
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // GET POSTS
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If there is no token, go to login
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:2000/api/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) =>
        response.json().then((data) => ({ response, data }))
      )
      .then(({ response, data }) => {
        console.log("POSTS:", data);

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (response.ok) {
          setPosts(data.posts);
          setLoading(false);
        } else {
          setMessage(data.message || "Failed to get posts");
          setLoading(false);

          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error getting posts:", error);

        setMessage("Unable to connect to server");
        setLoading(false);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  }, [navigate]);

  // CREATE POST
  const handleCreatePost = async () => {
    if (!title || !content) {
      setMessage("Please fill in title and content");

      const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
          setMessage("");
        }, 3000);
      };

      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://fullstack-blogpost-backend.onrender.com/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create post");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }

      setPosts((previousPosts) => [
        ...previousPosts,
        data.post,
      ]);

      setTitle("");
      setContent("");

      showMessage("Post created successfully");
    } catch (error) {
      console.error("Create post error:", error);

      setMessage("Unable to connect to server");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE POST
  const handleDeletePost = async (id) => {
    setDeletingId(id);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `https://fullstack-blogpost-backend.onrender.com/api/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete post");

        const showMessage = (text) => {
          setMessage(text);

          setTimeout(() => {
            setMessage("");
          }, 3000);
        };
        return;
      }

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== id)
      );

      setMessage("Post deleted successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Delete post error:", error);

      showMessage("Post created successfully");

    } finally {
      setDeletingId(null);
    }

  };

  // UPDATE POST
  const handleUpdatePost = async (id) => {
    if (!title || !content) {
      const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
          setMessage("");
        }, 3000);
      };

      return;
    }
    setSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:2000/api/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update post");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === id ? data.post : post
        )
      );

      setTitle("");
      setContent("");
      setEditingId(null);

      showMessage("Post created successfully");

    } catch (error) {
      console.error("Update post error:", error);

      setMessage("Unable to connect to server");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="posts-page">
      <div className="posts-container">

        <div className="posts-header">
          <h1>My Blog</h1>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="form-box">
          <h2>
            {editingId ? "Edit Post" : "Create Post"}
          </h2>
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
          ></textarea>

          <button
            className="create-button"
            onClick={() => {
              if (editingId) {
                handleUpdatePost(editingId);
              } else {
                handleCreatePost();
              }
            }}
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