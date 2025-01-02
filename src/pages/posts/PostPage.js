import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

// Component that is responsible for displaying a single post along
// with its details. It fetches the post data from the server using
// the post ID from the URL parameters and then renders the Post
// component to display the post.
function PostPage() {
    const  {id} = useParams();
    const [post, setPost] = useState({results : []});

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{ data: post }] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                ]);
                setPost({ results: [post] });
                console.log("Fetched Post Data:", post);
            } catch (err) {
                console.error("Post fetch failed:", err);
            }
        };

        handleMount();
    }, [id]); // Runs when id changes

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <p>Popular profiles for mobile</p>
                {<Post {...post.results[0]} setPosts={setPost} />} 
                <Container className={appStyles.Content}>Comments</Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                Popular profiles for desktop
            </Col>
        </Row>
    );
}

export default PostPage;
