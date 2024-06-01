import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import banner from "../assets/profile.jpg";

interface User {
  id: string;
  email: string;
}
const ButtonSection = () => {
  const userDataString: string | null = localStorage.getItem("user");
  const navigate = useNavigate();
  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  const logOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="button_bar">
      <div className="button_bar_icons">
        <Link to="/">
          <AiFillHome title="Home"/>
        </Link>
        {user && <AiOutlineLogout onClick={logOut} title="logOut" />}

        {/* <AiFillProfile /> */}
        <Link to={"/profile"}>
          <img src={banner} alt="" className="profile_show" />
        </Link>
      </div>
    </div>
  );
};

export default ButtonSection;
