import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const { handleLogin } = useSetCurrentUser();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(username, password);
            navigate("/"); // Navigate to the home page after successful login
        } catch (err) {
            console.error("Login failed:", err);
            setErrors(
                err.response?.data || { non_field_errors: ["Login failed."] }
            );
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4`}>
                    <h1 className={styles.Header}>Sign In</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                                className={styles.Input}
                            />
                        </Form.Group>
                        {errors.username && (
                            <Alert variant="warning">{errors.username}</Alert>
                        )}
                        <Form.Group controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className={styles.Input}
                            />
                        </Form.Group>
                        {errors.password && (
                            <Alert variant="warning">{errors.password}</Alert>
                        )}
                        {errors.non_field_errors && (
                            <Alert variant="warning">
                                {errors.non_field_errors}
                            </Alert>
                        )}
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                        >
                            Sign In
                        </Button>
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
