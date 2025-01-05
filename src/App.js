import React from "react";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostEditForm from "./pages/posts/PostEditForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import NotFound from "./components/NotFound";

// import MapLeaflet from "./components/MapLeaflet";
// import Button from "react-bootstrap/Button";
// import Footer from "./components/Footer";

function App() {
    const currentUser = useCurrentUser();
    //const profile_id = currentUser?.profile?.id || "";

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
                                //filter={`owner__followed__owner__profile=${profile_id}&`}
                                filter={`followed_users=True&`}
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
                    <Route path="/posts/:id/edit" element={<PostEditForm />} />
                    <Route path="/profiles/:id" element={<ProfilePage />} />
                    <Route
                        path="/profiles/:id/edit/username"
                        element={<UsernameForm />}
                    />
                    <Route
                        path="/profiles/:id/edit/password"
                        element={<UserPasswordForm />}
                    />
                    <Route
                        path="/profiles/:id/edit"
                        element={<ProfileEditForm />}
                    />
                    <Route path="*" element={<NotFound/>} />
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
