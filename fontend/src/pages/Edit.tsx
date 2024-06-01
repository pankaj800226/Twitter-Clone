import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const [title, setTitle] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEdit = () => {
    try {
      axios.put("http://localhost:8000/edit/" + id, { title });
      toast.success("updated successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .post("http://localhost:8000/getRoute/" + id)
      .then((result) => {
        setTitle(result.data.title);
      })
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <>
      <div className="poatAnd_upload_section">
        <div className="profile_image">
          <input
            type="text"
            placeholder="Enter Your Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="social_media">
          <div className="social_media_icon"></div>

          <div className="upload_btn">
            <button type="submit" onClick={handleEdit}>
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
