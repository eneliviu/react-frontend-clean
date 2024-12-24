import React from "react";
import "./Header.css";

function Header() {
    return (
        <div className="App-header">
            <h1>Welcome to My App</h1>
            <nav>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;