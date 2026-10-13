import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PostDetails() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/api/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load post");
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
    }, [API_URL, id]);

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