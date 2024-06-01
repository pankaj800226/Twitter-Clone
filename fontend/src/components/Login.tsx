import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase";
interface User {
  id: string;
  email: string;
  uid: string;
  user: string;
}
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("All fields are required");
    }

    try {
      const users = await signInWithEmailAndPassword(auth, email, password);
      await localStorage.setItem("user", JSON.stringify(users));

      const user = users.user;
      const userDataString: string | null = localStorage.getItem("user");

      const localUser: User | null = userDataString
        ? (JSON.parse(userDataString) as User)
        : null;

      if (localUser && localUser.uid === user.uid) {
        navigate("/");
      } else {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      }
      toast.success("Login successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("login failed");
    }
  };

  const signWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDataString: string | null = localStorage.getItem("user");

      const localUser: User | null = userDataString
        ? (JSON.parse(userDataString) as User)
        : null;

      if (localUser && localUser.uid === user.uid) {
        navigate("/");
      } else {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="contact_container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="form-group"></div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {/* <label onClick={hideShowHandler}>{hide ? <FaEye /> : <FiEyeOff />}</label> */}
        </div>

        <div className="form-group">
          <button type="submit">Login</button>
          <span>
            Already have an account? <Link to="/register">Register</Link>
          </span>
        </div>
      </form>
      <button className="google_login" onClick={signWithGoogle}>
        Sign With Google
      </button>
    </div>
  );
};

export default Login;
