// rafce

import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
    // Access the data from the CurrentUserContext
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const { expanded, setExpanded, ref } = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            //await axios.post("/dj-rest-auth/logout/");
            setCurrentUser(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            delete axios.defaults.headers.common["Authorization"];
            console.log("currentUser: ", currentUser);

        } catch (err) {
            console.error("Failed to sign out:", err);
        }
    };

    const addPostIcon = (
        <NavLink
            exact="true"
            className={({ isActive }) =>
                `${styles.NavLink} ${isActive ? styles.Active : ""}`
            }
            to="/posts/create"
        >
            <i className="fas fa-plus-square"></i>Add Post
        </NavLink>
    );

    const loggedInIcons = (
        <>
            <NavLink
                className={({ isActive }) =>
                    `${styles.NavLink} ${isActive ? styles.Active : ""}`
                }
                to="/feed"
            >
                <i className="fas fa-stream"></i>Feed
            </NavLink>

            <NavLink
                className={({ isActive }) =>
                    `${styles.NavLink} ${isActive ? styles.Active : ""}`
                }
                to="/liked"
            >
                <i className="fas fa-heart"></i>Liked
                {/* <span className="d-none d-md-inline">Liked</span> */}
            </NavLink>

            <NavLink
                className={styles.NavLink}
                to="/signin"
                onClick={handleSignOut}
            >
                <i className="fas fa-sign-out-alt"></i>Sign out
            </NavLink>

            <NavLink
                exact="true"
                className={styles.NavLink}
                to={`/profiles/${currentUser?.profile_id}`}
            >
                <Avatar
                    src={currentUser?.profile_image}
                    height={40}
                    text={currentUser?.username}
                />
            </NavLink>
        </>
    );

    const loggedOutIcons = (
        <>
            <NavLink
                exact="true"
                className={({ isActive }) =>
                    `${styles.NavLink} ${isActive ? styles.Active : ""}`
                }
                to="/signin"
            >
                <i className="fas fa-sign-in-alt"></i>Sign in
            </NavLink>
            <NavLink
                exact="true"
                className={({ isActive }) =>
                    `${styles.NavLink} ${isActive ? styles.Active : ""}`
                }
                to="/signup"
            >
                <i className="fas fa-user-plus"></i>Sign up
            </NavLink>
        </>
    );

    return (
        <Navbar
            expanded={expanded}
            className={styles.NavBar}
            expand="md"
            fixed="top"
        >
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addPostIcon}
                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-start">
                        <NavLink
                            to="/"
                            exact="true"
                            className={({ isActive }) =>
                                `${styles.NavLink} ${
                                    isActive ? styles.Active : ""
                                }`
                            }
                        >
                            <i className="fas fa-home"></i>Home
                        </NavLink>

                        {currentUser ? loggedInIcons : loggedOutIcons}

                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

export default NavBar;
