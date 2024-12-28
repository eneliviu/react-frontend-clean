import React from "react";
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
// import axios from "axios";
// import { useEffect } from "react";

function App() {

    // Call this function on page load to set the token from local storage
    // useEffect(() => {
    //     const token = localStorage.getItem("access_token");
    //     axios.defaults.headers.common["Authorization"] = token
    //         ? `Bearer ${token}`
    //         : undefined;
    // }, []);

    return (
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                <Routes>
                    <Route exact path="/" element={<h1>Home page</h1>} />
                    <Route exact path="/signin" element={<SignInForm />} />
                    <Route exact path="/signup" element={<SignUpForm />} />
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
    );
}

export default App;
