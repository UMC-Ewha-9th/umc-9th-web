// 유저의 정보를 조회하는 페이지

import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";

const MyPage = () => {
    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                return;
            }

            const response = await getMyInfo();
            console.log(response);
        };

        getData();
    }, []);
    return <div>My Page</div>;
};

export default MyPage;
