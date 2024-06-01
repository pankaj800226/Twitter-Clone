import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { ProtectedAuth } from "./protectedRoute/ProtectedAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Loading";
import Header from "./components/Header";

const Home = React.lazy(() => import("./pages/Home"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Upload = React.lazy(() => import("./pages/Upload"));
const SavePost = React.lazy(() => import("./pages/SavePost"));
const Edit = React.lazy(() => import("./pages/Edit"));
const ChatRoom = React.lazy(() => import("./pages/ChatRoom"));

// style component
import "./styles/home.scss";
import "./styles/header.scss";
import "./styles/loading.scss";
import "./styles/signup.scss";
import "./styles/profile.scss";
import "./styles/upload.scss";
import "./styles/ChatMEssage.scss";

// import ButtonSection from "./components/ButtonSection";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      <Router>
        <Header />
        <Suspense fallback={<Loading />}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedAuth>
                      <Home />
                    </ProtectedAuth>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedAuth>
                      <Profile />
                    </ProtectedAuth>
                  }
                />

                <Route
                  path="/post"
                  element={
                    <ProtectedAuth>
                      <Upload />
                    </ProtectedAuth>
                  }
                />

                <Route
                  path="/save"
                  element={
                    <ProtectedAuth>
                      <SavePost />
                    </ProtectedAuth>
                  }
                />

                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedAuth>
                      <Edit />
                    </ProtectedAuth>
                  }
                />

                <Route
                  path="/message"
                  element={
                    <ProtectedAuth>
                      <ChatRoom />
                    </ProtectedAuth>
                  }
                />
              </Routes>
              <ToastContainer />
            </>
          )}
        </Suspense>
        {/* <ButtonSection/> */}
      </Router>
    </>
  );
};

export default App;
