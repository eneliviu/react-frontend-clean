// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "../../styles/SignInUpForm.module.css";
// import btnStyles from "../../styles/Button.module.css";
// import appStyles from "../../App.module.css";
// import {
//     Form,
//     Button,
//     Col,
//     Row,
//     Container,
//     Alert,
//     Image,
// } from "react-bootstrap";
// import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

// function SignInForm() {
//     const setCurrentUser = useSetCurrentUser();
//     const [signInData, setSignInData] = useState({
//         username: "",
//         password: "",
//     });
//     const { username, password } = signInData;
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setSignInData({
//             ...signInData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const tokenUser = await axios.post(
//                 "http://127.0.0.1:8000/api-auth/token/",
//                 { username, password }
//             );
//             const { access, refresh } = tokenUser.data;
//             localStorage.setItem("access_token", access);
//             localStorage.setItem("refresh_token", refresh);

//             axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

//             const userResponse = await axios.get(
//                 "http://127.0.0.1:8000/dj-rest-auth/user/"
//             );
//             setCurrentUser(userResponse.data);

//             navigate("/");
//         } catch (err) {
//             console.error("Error during form submission:", err);
//             setErrors(
//                 err.response?.data || {
//                     non_field_errors: ["Invalid login credentials"],
//                 }
//             );
//         }
//     };

//     return (
//         <Row className={styles.Row}>
//             <Col className="my-auto p-0 p-md-2" md={6}>
//                 <Container className={`${appStyles.Content} p-4 `}>
//                     <h1 className={styles.Header}>sign in</h1>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3" controlId="username">
//                             <Form.Label className="d-none">username</Form.Label>
//                             <Form.Control
//                                 className={styles.Input}
//                                 type="text"
//                                 placeholder="username"
//                                 name="username"
//                                 value={username}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         {errors.username &&
//                             errors.username.map((message, idx) => (
//                                 <Alert variant="warning" key={idx}>
//                                     {message}
//                                 </Alert>
//                             ))}

//                         <Form.Group className="mb-3" controlId="password">
//                             <Form.Label className="d-none">username</Form.Label>
//                             <Form.Control
//                                 className={styles.Input}
//                                 type="password"
//                                 placeholder="Password"
//                                 name="password"
//                                 value={password}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         {errors.password &&
//                             errors.password.map((message, idx) => (
//                                 <Alert variant="warning" key={idx}>
//                                     {message}
//                                 </Alert>
//                             ))}

//                         <Button
//                             className={`${btnStyles.Button}  ${btnStyles.Wide} ${btnStyles.Bright}`}
//                             type="submit"
//                         >
//                             Sign in
//                         </Button>
//                         {errors.non_field_errors &&
//                             errors.non_field_errors.map((message, idx) => (
//                                 <Alert
//                                     key={idx}
//                                     variant="warning"
//                                     className="mt-3"
//                                 >
//                                     {message}
//                                 </Alert>
//                             ))}
//                     </Form>
//                 </Container>
//             </Col>
//             <Col
//                 md={6}
//                 className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
//             >
//                 <Image
//                     className={`${appStyles.FillerImage}`}
//                     src={
//                         "https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"
//                     }
//                 />
//             </Col>
//         </Row>
//     );
// }

// export default SignInForm;

// ### Key Changes:

// 1. **Centralized Token Handling Post-Login:**
//    - Removed the manual setting of `axios.defaults.headers.common["Authorization"]` 
// during the login process. The authorization header is now only set once the token
// is retrieved and stored. This ensures that the token is only set when it is available 


// 2. **Integration with Central Context:**
//    - Once the user is authenticated and the tokens are stored, use setCurrentUser from
// the context to trigger actions that depend on having the current user set, 
// like data pre-fetching. This ensures that the user context is updated with the 


// 3. **Error Handling Enhancements:**
//    - Ensure that errors are captured and displayed to users appropriately, 
// maintaining consistency with the user feedback mechanism. This includes handling 
// errors from the server response and displaying them in the form.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

// Optimize your bootstrap imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";


import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser();
    useRedirect("loggedIn");

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
            const tokenUser = await axios.post(
                "/api-auth/token/",
                { username, password }
            );
            const { access, refresh } = tokenUser.data;
            //setTokenTimestamp(tokenUser.data);
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Fetch user info and update the current user context
            const userResponse = await axios.get(
                "/dj-rest-auth/user/",  // Get the current user info
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
            setCurrentUser(userResponse.data);
            navigate(-1); // Navigate back to the previous page

        } catch (err) {
            console.error("Error during form submission:", err);
            setErrors(
                err.response?.data || {
                    non_field_errors: ["Invalid login credentials"],
                }
            );
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
                            <Form.Label className="d-none">password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
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
                            Sign in
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

