
// axios.defaults.baseURL = "https://dj-drf-api-763634fa56e5.herokuapp.com";

import { rest } from "msw"; // Import the helper function to create the handlers


const baseURL = "http://127.0.0.1:8000/";


export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json({
                pk: 1,
                username: "admin",
                email: "",
                first_name: "",
                last_name: "",
                profile_id: 1,
                profile_image:
                    "http://res.cloudinary.com/dchoskzxj/image/upload/v1736014786/wzq2v9djazgix6cnfkg5.webp",
            })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    })
];

