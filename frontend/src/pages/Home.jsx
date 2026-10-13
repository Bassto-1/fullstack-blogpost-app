import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/api/posts/public`)
            .then((response) => response.json())
            .then((data) => {
                setPosts(data.posts || []);
            })
            .catch((error) => {
                console.error("Error getting posts:", error);
            });
    }, [API_URL]);

    function handlePostClick(postId) {
        if (isLoggedIn) {
            navigate(`/posts/${postId}`);
        } else {
            navigate("/login", {
                state: { from: `/posts/${postId}` }
            });
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    }

    return (
        <div className="home-page">
            <h1>My Blog</h1>

            <nav className="home-nav">
                {isLoggedIn ? (
                    <>
                        <Link to="/posts">Create Post & My Posts</Link>
                        {" | "}
                        <button onClick={handleLogout}>Logout</button>
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

                        {!isLoggedIn && <p>Log in to read more</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;