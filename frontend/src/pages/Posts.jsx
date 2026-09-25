
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      .then((response) => response.json())
      .then((data) => {
        console.log("POSTS:", data);

        if (data.posts) {
          setPosts(data.posts);
        } else {
          console.log("Failed to get posts");
          setPosts([]);
        }
      })
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  }, [navigate]);

  // CREATE POST
  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:2000/api/posts",
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

    console.log("CREATE POST:", data);

    if (response.ok) {
      setPosts((previousPosts) => [
        ...previousPosts,
        data.post,
      ]);

      setTitle("");
      setContent("");
    }
  };

  // DELETE POST
  const handleDeletePost = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:2000/api/posts/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("DELETE POST:", data);

    if (response.ok) {
      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== id)
      );
    }
  };

  // UPDATE POST
  const handleUpdatePost = async (id) => {
    const token = localStorage.getItem("token");

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

    console.log("UPDATE POST:", data);

    if (response.ok) {
      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === id ? data.post : post
        )
      );

      setTitle("");
      setContent("");
      setEditingId(null);
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
          >
            {editingId ? "Update Post" : "Create Post"}
          </button>
        </div>

        <div className="posts-list">
          <h2>My Posts</h2>

          {posts.map((post) => (
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
                onClick={() =>
                  handleDeletePost(post._id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Posts;