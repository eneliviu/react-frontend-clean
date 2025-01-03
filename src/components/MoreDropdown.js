import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";

// // The forwardRef is important!!
// // Dropdown needs access to the DOM node in order to position the Menu

// const ThreeDots = React.forwardRef(({ onClick }, ref) => (
//     <i
//         className="fa fa-ellipsis-v"
//         ref={ref}
//         onClick={(e) => {
//             e.preventDefault();
//             onClick(e);
//         }}
//         aria-label="More options"
//         role="button"
//         tabIndex="0"
//     />
// ));

// export const MoreDropdown = ({ handleEdit, handleDelete }) => {
//     return (
//         <Dropdown className="ml-auto" drop="start">
//             <Dropdown.Toggle as={ThreeDots} id="dropdown-custom-components" />

//             <Dropdown.Menu
//                 className="text-center"
//                 popperConfig={{ strategy: "fixed" }}
//             >
//                 <Dropdown.Item
//                     className={styles.DropdownItem}
//                     onClick={handleEdit}
//                     aria-label="edit"
//                 >
//                     <i className="fas fa-edit" />
//                 </Dropdown.Item>

//                 <Dropdown.Item
//                     className={styles.DropdownItem}
//                     onClick={handleDelete}
//                     aria-label="delete"
//                 >
//                     <i className="fas fa-trash-alt" />
//                 </Dropdown.Item>
//             </Dropdown.Menu>
//         </Dropdown>
//     );
// };

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
