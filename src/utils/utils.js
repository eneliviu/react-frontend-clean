import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
    try {
        const { data } = await axiosReq.get(resource.next);
        setResource((prevResource) => ({
            ...prevResource,
            next: data.next,
            results: data.results.reduce((acc, curr) => {
                return acc.some((accResult) => accResult.id === curr.id)
                    ? acc
                    : [...acc, curr];
            }, prevResource.results),
        }));
    } catch (err) {
        console.error("Failed to fetch more data:", err);
    }
};
