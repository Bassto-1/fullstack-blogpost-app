import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to submit request"
                );
            }

            setMessage(data.message);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-box">
                <h1>Forgot Password?</h1>
                <p>Enter the email address.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {message && <p>{message}</p>}
                {error && <p role="alert">{error}</p>}

                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}

export default ForgotPassword;
