import React from "react";
import "./App.css";
import MapLeaflet from "./components/MapLeaflet";
import Button from "react-bootstrap/Button";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="App">
            <NavBar />
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
