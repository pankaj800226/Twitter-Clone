import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
interface User {
  id: string;
  email: string;
}
const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userDataString: string | null = localStorage.getItem("user");

  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  const logOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <header>
      <div className="logo">
        <Link to={"/"}>
          <img src="logo.png" alt="" height={35} width={35} />
        </Link>
        <div></div>
        <Button component={Link} to={"/"}></Button>
      </div>
      {/* <Link to={"/register"}>SignUp</Link> */}
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="icons"
      >
        {/* <FaUser /> */}
        <h2 className="user">{user?.email.charAt(0)}</h2>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link to={"/profile"}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        {/* 
        <Link to={"/save"}>
          <MenuItem onClick={handleClose}>SavePost</MenuItem>
        </Link> */}

        <Link to={"/message"}>
          <MenuItem onClick={handleClose}>Chat</MenuItem>
        </Link>

        {user && <MenuItem onClick={logOut}>Logout</MenuItem>}
      </Menu>
    </header>
  );
};

export default Header;
