
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);
    if (!email || !password) {
      setMessage("Please enter email and password");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:2000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }

      if (!data.token) {
        setMessage("Login failed");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/posts");
    } catch (error) {
      console.error("Login error:", error);

      setMessage("Unable to connect to server");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p>{message}</p>}

        <p>
          Don't have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;