import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";
import { FaLongArrowAltDown } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import axios from "axios";
import Loading2 from "../components/Loading2";
import Upload from "./Upload";
import { BsFillSave2Fill } from "react-icons/bs";

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface Post extends User {
  _id: string;
  title: string;
  photo: string;
  comments: string[];
  createdAt: string;
  likes: number;
}

const Home = () => {
  const [allPost, setAllPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [postComment, setPostComment] = useState<string>("");
  const userDataString: string | null = localStorage.getItem("user");
  const user: User | null = userDataString
    ? (JSON.parse(userDataString) as User)
    : null;

  // all post api
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const response = await axios.post("http://localhost:8000/allData");
        setAllPost(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(`some error${error}`);
      }
    };

    fetchAllPost();
  }, [allPost]);

  const postDownload = (photo: string, photographer: string) => {
    try {
      const filename = photographer + ".jpg";
      saveAs(photo, filename);
      toast.success("Downloading image");
    } catch (error) {
      console.log(error);
      toast.error(`some error${error}`);
    }
  };

  // post comment api
  const handleComment = async (id: string, comment: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/comment/${id}`, {
        comment,
      });
      console.log("Comment added successfully:", response.data);
      toast.success("Comment added successfully");
      setPostComment("");
    } catch (error) {
      console.log(error);
      toast.error(`Error adding comment${error}`);
    }
  };

  //post like api
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
      console.error("Error liking image:", error);
      toast.error(`some error${error}`);
    }
  };

  return (
    <>
      <Upload />

      <div className="home_container">
        {loading ? (
          <Loading2 />
        ) : allPost.length === 0 ? (
          <p>Post not found</p>
        ) : (
          allPost.map((post) => (
            <div className="home_bar" key={post.id}>
              <div className="top_section">
                <span>{user?.email.charAt(0).toUpperCase()}</span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <p style={{ color: "white" }}>{user?.displayName}</p>
                  <p style={{ color: "white" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <BsFillSave2Fill title="Save" color="white" />
              </div>
              <div className="post_section">
                <div className="imgUrl">
                  <img
                    src={`http://localhost:8000/image/${post.photo}`}
                    alt=""
                    onDoubleClick={() => handleLike(post._id)}
                  />
                </div>
                <div className="title">
                  <h2>{post.title}</h2>
                </div>

                <div className="post_icons">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleLike(post._id)}
                    >
                      <FcLike title="Like" />
                    </IconButton>
                    <p>{post.likes}</p>

                    <IconButton
                      aria-label="delete"
                      onClick={() => handleUnlike(post._id)}
                    >
                      <AiOutlineHeart title="UnlikeLike" />
                    </IconButton>
                  </div>

                  <IconButton
                    onClick={() => postDownload(post.photo, post.title)}
                    aria-label="delete"
                  >
                    <FaLongArrowAltDown title="Download" />
                  </IconButton>
                </div>

                <div className="all_comment">
                  <p>
                    {post.comments.map((comment, index) => (
                      <div key={index}>
                        <p>{comment}</p>
                        {/* <Button
                          onClick={() => handleDeleteComment(post._id, comment)}
                        >
                          Remove
                        </Button> */}
                        {/* <p>{comment.length}</p> */}
                      </div>
                    ))}
                  </p>
                </div>

                <div className="comment_bar">
                  <input
                    type="text"
                    placeholder="Add Comment"
                    onChange={(e) => setPostComment(e.target.value)}
                    value={postComment}
                  />
                  <button onClick={() => handleComment(post._id, postComment)}>
                    <IoSend />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
