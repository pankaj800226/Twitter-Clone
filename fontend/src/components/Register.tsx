import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8;
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error("Password should be at least 8 characters long");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("User created successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/login");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error("User exiting");
    }
  };

  return (
    <div className="contact_container">
      <form onSubmit={handleSignUp}>
        <h2>SignUp</h2>

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
            type="password" // Change type to password
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {/* <label onClick={hideShowHandler}>{hide ? <FaEye /> : <FiEyeOff />}</label> */}
        </div>

        <div className="form-group">
          <button type="submit">Register</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
