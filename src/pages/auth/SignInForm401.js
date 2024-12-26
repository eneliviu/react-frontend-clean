import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SetCurrentUserContext } from "../../App";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import {
    Form,
    Button,
    Col,
    Row,
    Container,
    Alert,
    Image,
} from "react-bootstrap";

function SignInForm() {
    const setCurrentUser = useContext(SetCurrentUserContext);

    const [signInData, setSignInData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = signInData;
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name]: e.target.value,
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("Submitting form with data:", signInData);
    //     try {
    //         // Log in the user and get the token
    //         const loginResponse = await axios.post(
    //             "http://127.0.0.1:8000/dj-rest-auth/login/",
    //             signInData
    //         );
    //         console.log("Login response:", loginResponse);
    //         console.log("Now you are logged in ");

    //         const token = localStorage.getItem("jwt-auth");
    //         console.log("jwt-auth", token);

    //         // if (loginResponse && loginResponse.data) {
    //         //     const { key } = loginResponse.data;
    //         //     console.log("Login response data:", key);

    //         //     // Store the token in localStorage
    //         //     localStorage.setItem("jwt-auth", key);

    //         //     // Fetch the user details
    //         //     const userResponse = await axios.get(
    //         //         "http://127.0.0.1:8000/dj-rest-auth/user/",
    //         //         {
    //         //             headers: {
    //         //                 Authorization: `Bearer ${key}`,
    //         //             },
    //         //         }
    //         //     );
    //         //     console.log("User response:", userResponse.data);
    //         //     setCurrentUser(userResponse.data);

    //         //     // Navigate to home page on successful authentication
    //         //     navigate("/");
    //         // } else {
    //         //     console.error(
    //         //         "Login response is undefined or does not contain data."
    //         //     );
    //         // }

    //         // Fetch the user details
    //         const userResponse = await axios.get("/dj-rest-auth/user/", {
    //             withCredentials: true,
    //         });
    //         console.log("Current user data: ", userResponse.data);
    //         setCurrentUser(userResponse.data);

    //         // Navigate to home page on successful authentication
    //         navigate("/");
    //     } catch (err) {
    //         console.error("Error during form submission:", err);
    //         setErrors(err.response?.data);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", signInData);
        try {
            // Log in the user and get the token
            const { username, password } = signInData;
            const tokenUser = await axios.post(
                "http://127.0.0.1:8000/api-auth/token/",
                {
                    username,
                    password,
                }
            );
            const { accessToken, refreshToken } = tokenUser.data;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            console.log("Token user:", tokenUser.data);

            // Set the token in the headers for subsequent requests
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            const loginResponse = await axios.post(
                "http://127.0.0.1:8000/dj-rest-auth/login/",
                signInData
            );
            // Store the token in localStorage
            const { key } = loginResponse.data;
            localStorage.setItem("auth_token", key);
            console.log("Full login response: ", loginResponse);

            if (loginResponse && loginResponse.data) {
                const { accessToken, refreshToken } = loginResponse.data;
                console.log("Login response token:", accessToken);

                // Store the token in localStorage
                localStorage.setItem("jwt-auth", accessToken);

                // Fetch the user details after storing the token
                const userResponse = await axios.get(
                    "http://127.0.0.1:8000/dj-rest-auth/user/",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log("User response:", userResponse.data);
                setCurrentUser(userResponse.data);

                // Navigate to home page on successful authentication
                navigate("/");
            } else {
                console.error(
                    "Login response is undefined or does not contain data."
                );
            }
        } catch (err) {
            console.error("Error during form submission:", err);
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign in</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className="d-none">username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.username &&
                            errors.username.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="d-none">username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.password &&
                            errors.password.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}

                        <Button
                            className={`${btnStyles.Button}  ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                        >
                            Sign up
                        </Button>
                        {errors.non_field_errors &&
                            errors.non_field_errors.map((message, idx) => (
                                <Alert
                                    key={idx}
                                    variant="warning"
                                    className="mt-3"
                                >
                                    {message}
                                </Alert>
                            ))}
                    </Form>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={
                        "https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"
                    }
                />
            </Col>
        </Row>
    );
}

export default SignInForm;
