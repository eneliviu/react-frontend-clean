import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
// Import the configured axios instance
import { axiosReq } from "../../api/axiosDefaults";
import { Alert } from "react-bootstrap";

function PostEditForm() {
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        image: "",
    });
    const { title, content, image } = postData;
    const [errors, setErrors] = useState({});

    const imageInput = useRef(null); // Reference to the file input element
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}/`);
                const { title, content, image, is_owner } = data;

                is_owner
                    ? setPostData({ title, content, image })
                    : navigate("/"); // Redirect if the user is not the owner
            } catch (err) {
                console.error("Post fetch failed:", err);
            }
        };

        handleMount();
    }, [navigate, id]);

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
            });
            //console.log("image URL", event.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        console.log(
            "imageInput.current.files[0]: ",
            imageInput.current.files[0]
        );
        // Check if there is a new image or existing one should be kept
        if (imageInput.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }

        try {
            // Use axiosReq which handles headers and token management
            // Unlike `PUT`, which generally expects all fields, 
            // `PATCH` is designed for partial updates.
            await axiosReq.patch(`/posts/${id}/`, formData);
            navigate(`/posts/${id}/`);
        } catch (err) {
            console.error("Failed to create post:", err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            } else {
                // Additional handling if needed on unauthorized
                console.warn(
                    "You might be unauthorized to perform this action."
                );
            }
        }
    };

    const textFields = (
        <div className="text-center">
            <Form.Group>
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
            ))}
            <Form.Group>
                <Form.Label htmlFor="content">Content</Form.Label>
                <Form.Control
                    as="textarea"
                    id="content"
                    name="content"
                    value={content}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.content?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
            ))}
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => navigate(-1)} //  Go back to the previous page
            >
                cancel
            </Button>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
            >
                save
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            <figure>
                                <Image
                                    className={styles.ImagePreview}
                                    src={image}
                                    rounded
                                />
                            </figure>

                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>

                            <Form.Control
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />
                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>
                        {textFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;
