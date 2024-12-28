import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser();

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

    const setAuthToken = (token) => {
        token
            ? (axios.defaults.headers.common[
                  "Authorization"
              ] = `Bearer ${token}`)
            : delete axios.defaults.headers.common["Authorization"];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", signInData);
        try {
            const { username, password } = signInData;
            const tokenUser = await axios.post(
                "http://127.0.0.1:8000/api-auth/token/",
                {
                    username,
                    password,
                }
            );
            const { access, refresh } = tokenUser.data;
            // Store tokens in localStorage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Set the token in the headers for subsequent requests
            setAuthToken(access);

            // Fetch the user details
            const userResponse = await axios.get(
                "http://127.0.0.1:8000/dj-rest-auth/user/",
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
            console.log("Current user data: ", userResponse.data);
            console.log(
                "URL to profile data: ",
                `http://127.0.0.1:8000/profiles/${userResponse.data.pk}/`
            );
            const userData = await axios.get(
                `http://127.0.0.1:8000/profiles/${userResponse.data.pk}/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );

            console.log("Profile data: ", userData.data);
            // Set the current user in the context
            setCurrentUser(userResponse.data);

            // On successful auth go to home page
            navigate("/");
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
