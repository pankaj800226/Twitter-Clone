import { ChangeEvent, useState } from "react";
import { IoSend } from "react-icons/io5";
import banner from "../assets/profile.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import DalyWishes from "./DalyWishes";
interface User {
  id: string;
  email: string;
}

const Upload = () => {
  const userDataString: string | null = localStorage.getItem("user");

  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePost = () => {
    if (file && title.trim() !== "") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      try {
        axios.post("http://localhost:8000/upload", formData);
        toast.success("Post uploaded successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("all fields are required");
    }
    setTitle("");
  };
  return (
    <>
      <div className="poatAnd_upload_section">
        <div className="profile_image">
          <span>{user?.email.charAt(0).toUpperCase()}</span>
          <input
            type="text"
            placeholder="Enter Your Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="daly_widhes">
          <DalyWishes />
        </div>
        <div className="social_media">
          <div className="social_media_icon"></div>
          <div className="social_media_icon">
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file" className="upload-button">
              <IoSend /> Upload
            </label>
          </div>

          <div className="upload_btn">
            <button type="submit" onClick={handlePost}>
              <IoSend />
            </button>
          </div>
          <img
            src={file ? URL.createObjectURL(file) : banner}
            alt=""
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Upload;
