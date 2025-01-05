import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useNavigate } from "react-router-dom";



const ThreeDotsToggle = React.forwardRef(({ onClick }, ref) => (
    <div
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        aria-label="More options"
        role="button"
        tabIndex="0"
        style={{ cursor: "pointer" }} // Additional styling to indicate it's interactive
    >
        <i className="fa fa-ellipsis-v"></i>
    </div>
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto">
            <Dropdown.Toggle
                as={ThreeDotsToggle}
                id="dropdown-custom-components"
            />

            <Dropdown.Menu
                className="text-center"
                popperConfig={{ strategy: "absolute" }}
            >
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit"
                >
                    <i className="fas fa-edit" /> 
                </Dropdown.Item>

                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete"
                >
                    <i className="fas fa-trash-alt" /> 
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export function ProfileEditDropdown({ id }) {
    const navigate = useNavigate();
    return (
        <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
            <Dropdown.Toggle as={ThreeDotsToggle} />
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => navigate(`/profiles/${id}/edit`)}
                    aria-label="edit-profile"
                >
                    <i className="fas fa-edit" /> edit profile
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => navigate(`/profiles/${id}/edit/username`)}
                    aria-label="edit-username"
                >
                    <i className="far fa-id-card" />
                    change username
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => navigate(`/profiles/${id}/edit/password`)}
                    aria-label="edit-password"
                >
                    <i className="fas fa-key" />
                    change password
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
