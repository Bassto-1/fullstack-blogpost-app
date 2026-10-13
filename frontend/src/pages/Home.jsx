import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    // Get all public posts
    useEffect(() => {
        fetch(`${API_URL}/api/posts/public`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load posts");
                }

                return response.json();
            })
            .then((data) => {
                setPosts(data.posts || []);
            })
            .catch((error) => {
                console.error("Error getting posts:", error);
            });
    }, [API_URL]);

    // Check whether the logged-in user is an admin
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
            setIsAdmin(false);
            return;
        }

        fetch(`${API_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to verify user");
                }

                return response.json();
            })
            .then((data) => {
                setIsLoggedIn(true);
                setIsAdmin(data.user?.role === "admin");
            })
            .catch((error) => {
                console.error("Error checking user:", error);
                setIsAdmin(false);
            });
    }, [API_URL]);

    // Open a post or ask the visitor to log in
    function handlePostClick(postId) {
        if (isLoggedIn) {
            navigate(`/posts/${postId}`);
        } else {
            navigate("/login", {
                state: { from: `/posts/${postId}` },
            });
        }
    }

    // Delete a post (admin only button)
    async function handleDelete(postId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `${API_URL}/api/posts/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete post"
                );
            }

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post._id !== postId)
            );
        } catch (error) {
            console.error("Delete error:", error);
            window.alert(error.message);
        }
    }

    // Log out
    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/");
    }

    return (
        <div className="home-page">
            <h1>My Blog</h1>

            <nav className="home-nav">
                {isLoggedIn ? (
                    <>
                        <Link to="/posts">
                            Create Post & My Posts
                        </Link>

                        {" | "}

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>

                        {" | "}

                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>

            <div className="home-posts">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="home-post-card"
                        onClick={() => handlePostClick(post._id)}
                        style={{ cursor: "pointer" }}
                    >
                        <h2>{post.title}</h2>

                        <p>
                            {post.content.length > 120
                                ? post.content.slice(0, 120) + "..."
                                : post.content}
                        </p>

                        {!isLoggedIn && (
                            <p>Log in to read more</p>
                        )}

                        {isAdmin && (
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleDelete(post._id);
                                }}
                            >
                                Delete Post
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
