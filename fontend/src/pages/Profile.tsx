import profile from "../assets/profile.jpg";
import { FiEdit } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading2 from "../components/Loading2";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import DeleteIcon from '@mui/icons-material/Delete';

// authentication
interface User {
  id: string;
  email: string;
  displayName: string;
}

// allpost
interface Post extends User {
  _id: string;
  title: string;
  photo: string;
  createdAt: string;
  likes: number;
}
const Profile = () => {
  const [allPost, setAllPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userDataString: string | null = localStorage.getItem("user");

  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  // all post api
  useEffect(() => {
    axios
      .post("http://localhost:8000/allData")
      .then((result) => {
        setAllPost(result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`some error${error}`);
      });
  }, [allPost]);

  const postDeleteHandle = (id: string) => {
    axios
      .delete(`http://localhost:8000/delete/${id}`)
      .then((result) => {
        console.log(result);
        toast.success("Delete successfully post");
      })
      .catch((error) => {
        console.log(error);
        toast.error(`some error${error}`);
      });
  };

  // like post api
  const handleLike = async (id: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/postLike/${id}`);
      const updatedPosts = allPost.map((post) => {
        if (post._id === id) {
          return { ...post, likes: response.data.likes };
        }
        return post;
      });
      setAllPost(updatedPosts);
    } catch (error) {
      console.error("Error liking image:", error);
      toast.error(`some error${error}`);
    }
  };

  // unlike post api

  const handleUnlike = async (id: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/postUnLike/${id}`
      );
      const updatePost = allPost.map((post) => {
        if (post._id === id) {
          return { ...post, likes: response.data.likes };
        }
        return post;
      });
      setAllPost(updatePost);
    } catch (error) {
      console.log(error);
      toast.error(`some error${error}`);
    }
  };

  return (
    <>
      <div className="profile_container">
        <div className="prifile_img">
          <img src={profile} alt="" />
        </div>

        <div className="profile_user_name">
          {/* <h2>{user?.email}</h2> */}
          <h2>{user?.displayName}</h2>
          <p>I am Coder</p>
          <p>Post : {allPost.length}</p>
        </div>
      </div>

      {loading ? (
        <Loading2 />
      ) : (
        <div className="profile">
          {allPost.length === 0 ? (
            <h2>Post Not Yet</h2>
          ) : (
            allPost.map((post) => (
              <div className="all_post" key={post.id}>
                <div className="user_auth">
                  <p>{user?.email.charAt(0)}</p>
                  <span>{user?.displayName}</span>
                </div>
                <div className="image">
                  <img
                    src={`http://localhost:8000/image/${post.photo}`}
                    alt=""
                    onDoubleClick={() => handleLike(post._id)}
                  />
                </div>

                <div className="post_title">
                  <p>Title : {post.title}</p>
                  <p style={{ fontSize: "15px" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="post_icons">
                  <div style={{display:'flex', alignItems:"center"}}>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleLike(post._id)}
                    >
                      <FcLike title="Like" />
                    </IconButton>
                      <p style={{ color: "white", padding: "0 10px" }}>
                        {post.likes}
                      </p>

                    <IconButton
                      aria-label="delete"
                      onClick={() => handleUnlike(post._id)}
                    >
                      <AiOutlineHeart
                        title="UnLike"
                        style={{ color: "white" }}
                      />
                    </IconButton>
                  </div>
                </div>

                <div className="button_section">
                  <Link to={`/edit/${post._id}`}>
                    <IconButton aria-label="edit">
                      <FiEdit title="Edit" />
                    </IconButton>
                  </Link>

                  <IconButton
                  // size="large"
                    aria-label="delete"
                    onClick={() => postDeleteHandle(post._id)}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
