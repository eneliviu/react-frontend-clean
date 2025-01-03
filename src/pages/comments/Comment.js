import React, { useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Comment.module.css";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosReq } from "../../api/axiosDefaults";
import CommentEditForm from "./CommentEditForm";
import { Container } from "react-bootstrap";

const Comment = (props) => {
    const {
        profile_id,
        profile_image,
        owner,
        updated_at,
        content,
        id,
        setPost,
        setComments,
    } = props;
    const [showEditForm, setShowEditForm] = useState(false);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            // Delete the comment
            await axiosReq.delete(`/comments/${id}/`);
            // Update the post and comments state
            setPost((prevPost) => ({
                results: [
                    {
                        ...prevPost.results[0],
                        comments_count: prevPost.results[0].comments_count - 1,
                    },
                ],
            }));
            // Remove the comment from the comments state
            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.filter(
                    (comment) => comment.id !== id
                ),
            }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <hr />

            <Container className="d-flex justify-content-between">
                <div className="d-flex container-fluid w-100">
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profile_image} />
                    </Link>
                    <div className="align-self-center ml-2 w-100">
                        <span className={styles.Owner}>{owner}</span>
                        <span className={styles.Date}>{updated_at}</span>
                        {showEditForm ? (
                            <CommentEditForm
                                id={id}
                                profile_id={profile_id}
                                content={content}
                                profileImage={profile_image}
                                setComments={setComments}
                                setShowEditForm={setShowEditForm}
                            />
                        ) : (
                            <p>{content}</p>
                        )}
                    </div>
                </div>

                <div className="justify-content-end">
                    {is_owner && !showEditForm && (
                        <MoreDropdown
                            handleEdit={setShowEditForm}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Container>
        </>
    );
};

export default Comment;
