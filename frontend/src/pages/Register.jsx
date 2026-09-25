
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
if (!name || !email || !password) 
  { setMessage("Please fill in all fields");
     return;
     } 
     setLoading(true); 
     setMessage("");


    try {
      const response = await fetch(
        "http://localhost:2000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message || "Registration completed");

  if (!response.ok) { setMessage(data.message || "Registration failed");
 return;
 }
  setMessage("Registration successful"); setTimeout(() => { navigate("/login"); }, 1000);
      
  } catch (error) { console.error(error); setMessage("Unable to connect to server");
    
   } finally { setLoading(false); } };

  return (
    <div className="auth-page">
    <div className="auth-box">
        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

       <button onClick={handleRegister} disabled={loading}>
         {loading ? "Registering..." : "Register"} 

       </button>

        {message && <p>{message}</p>}

        <p>
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;