import {useEffect, useState} from "react";

export const useFetch = (url: RequestInfo) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(url);
            const json = await response.json();
            setData(json);
        }
        fetchData().then((r) => {return r});
    }, [url]);
    return data;
};