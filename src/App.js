import React from "react";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
// import MapLeaflet from "./components/MapLeaflet";
// import Button from "react-bootstrap/Button";
// import Footer from "./components/Footer";

function App() {
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile?.id || "";

    console.log("currentUser: ", currentUser);

    return (
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PostsPage message="No results found. Adjust the search keyword." />
                        }
                    />
                    <Route
                        path="/feed"
                        element={
                            <PostsPage
                                message="No results found. Adjust the search keyword or follow a user."
                                filter={`owner__followed__owner__profile=${profile_id}&`}
                            />
                        }
                    />
                    <Route
                        path="/liked"
                        element={
                            <PostsPage
                                message="No results found. Adjust the search keyword or like a post."
                                //filter={`likes_owner_profile=${profile_id}&ordering=-likes__created_at&`}
                                filter={`liked_by_user=True&ordering=-likes__created_at&`}
                            />
                        }
                    />
                    <Route path="/signin" element={<SignInForm />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route path="/posts/create" element={<PostCreateForm />} />
                    <Route exact path="/posts/:id" element={<PostPage />} />
                    <Route path="*" element={<p>Page not found</p>} />
                </Routes>
            </Container>
            {/* <div style={{ paddingTop: "80px" }}>
                <Button variant="primary">Primary</Button>
            </div>
            <div style={{ paddingTop: "80px" }}>
                <MapLeaflet />
            </div> */}

            {/* <Footer /> */}
        </div>
    );
}

export default App;
