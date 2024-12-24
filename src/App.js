import React from "react";
import styles from "./App.module.css";
import { Container } from "react-bootstrap";
import MapLeaflet from "./components/MapLeaflet";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                <Routes>
                    <Route exact path="/" element={<h1>Home page</h1>} />
                    <Route
                        exact
                        path="/signin"
                        element={<h1>Sign-in page</h1>}
                    />
                    <Route
                        exact
                        path="/signup"
                        element={<h1>Sign-up page</h1>}
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
    );
}

export default App;
