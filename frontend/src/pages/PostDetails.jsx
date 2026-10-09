import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PostDetails() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/posts/public/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Post not found");
                }
                return response.json();
            })
            .then((data) => {
                setPost(data.post);
            })
            .catch((error) => {
                console.error("Error getting post:", error);
                setError(error.message);
            });
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Loading post...</p>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
    );
}

export default PostDetails;