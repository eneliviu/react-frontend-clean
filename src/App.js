import React, { useEffect, useState, createContext } from "react";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";
import MapLeaflet from "./components/MapLeaflet";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import axios from "axios";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    const handleMount = async () => {
        try {
            const { data } = await axios.get("/dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.error(err);
        }
    };

      useEffect(() => {
          handleMount();
      }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                <div className={styles.App}>
                    <NavBar />
                    <Container className={styles.Main}>
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={<h1>Home page</h1>}
                            />
                            <Route
                                exact
                                path="/signin"
                                element={<SignInForm />}
                            />
                            <Route
                                exact
                                path="/signup"
                                element={<SignUpForm />}
                            />
                            <Route path="*" element={<p>Page not found</p>} />
                        </Routes>
                    </Container>
                    <div style={{ paddingTop: "80px" }}>
                        <Button variant="primary">Primary</Button>
                    </div>
                    <div style={{ paddingTop: "80px" }}>
                        <MapLeaflet />
                    </div>

                    <Footer />
                </div>
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
}

export default App;
