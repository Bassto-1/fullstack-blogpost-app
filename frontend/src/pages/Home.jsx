import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Home() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [posts, setPosts] = useState([]);



    useEffect(() => {
        fetch(`${API_URL}/api/posts/public`)
            .then((response) => response.json())
            .then((data) => {
                console.log("POSTS:", data);
                setPosts(data.posts);
            })
            .catch((error) => {
                console.error("Error getting posts:", error);
            });
    }, []);

    return (
        <div className="home-page">
            <h1>My Blog</h1>

            <nav className="home-nav">
                <Link to="/login">Login</Link>
                {" | "}
                <Link to="/register">Register</Link>
            </nav>

            <div className="home-posts">
                {posts.map((post) => (
                    <Link
                        key={post._id}
                        to={`/posts/${post._id}`}
                        className="home-post-card"
                    >
                        <h2>{post.title}</h2>
                        <p>
                            {post.content.length > 120
                                ? post.content.slice(0, 120) + "..."
                                : post.content}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );

}

export default Home;
