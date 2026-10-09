import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    // fetch the post here
    useEffect(() => {
        fetch("https://fullstack-blogpost-backend.onrender.com/api/posts/public/POST_ID")
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
        "// display the post here"
    );
}

export default PostDetails;