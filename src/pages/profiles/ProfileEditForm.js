import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const imageFile = useRef(null);

    const [profileData, setProfileData] = useState({
        name: "",
        content: "",
        image: "",
    });
    const { name, content, image } = profileData;

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const { name, content, image } = data;
                    setProfileData({ name, content, image });
                } catch (err) {
                    console.error("Error fetching profile data:", err);
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        };

        handleMount();
    }, [currentUser, navigate, id]);

    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files.length) {
            URL.revokeObjectURL(image); // Clean up the old image URL
            setProfileData({
                ...profileData,
                image: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("content", content);

        if (imageFile.current?.files[0]) {
            formData.append("image", imageFile.current.files[0]);
        }

        try {
            const { data } = await axiosReq.patch(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            navigate(`/profiles/${id}`);
        } catch (err) {
            console.error("Error updating profile:", err);
            setErrors(err.response?.data || { image: ["An error occurred"] });
        }
    };

    const textFields = (
        <>
            <Form.Group>
                <Form.Label>Bio</Form.Label>
                <Form.Control
                    as="textarea"
                    value={content}
                    onChange={handleChange}
                    name="content"
                    rows={7}
                />
            </Form.Group>

            {errors?.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => navigate(-1)}
            >
                cancel
            </Button>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
            >
                save
            </Button>
        </>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
                    <Container className={appStyles.Content}>
                        <Form.Group>
                            {image && (
                                <figure>
                                    <Image src={image} fluid />
                                </figure>
                            )}
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>
                            <Form.Control
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={imageFile}
                            />
                        </Form.Group>
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col
                    md={5}
                    lg={6}
                    className="d-none d-md-block p-0 p-md-2 text-center"
                >
                    <Container className={appStyles.Content}>
                        {textFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileEditForm;