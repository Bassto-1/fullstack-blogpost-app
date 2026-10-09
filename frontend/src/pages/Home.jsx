import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Home() {
    const [posts, setPosts] = useState([]);



    useEffect(() => {
        fetch("https://fullstack-blogpost-backend.onrender.com/api/posts/public")
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
        <div>
            <h1>My Blog</h1>
            {posts.map((post) => (
                <Link key={post._id} to={`/posts/${post._id}`}>
                    <div>
                        <h2>{post.title}</h2>
                        <p>
                            {post.content.length > 120
                                ? post.content.slice(0, 120) + "..."
                                : post.content}
                        </p>
                    </div>
                </Link>


            ))}
        </div>
    );

}

export default Home;
