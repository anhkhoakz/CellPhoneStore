// src/components/CommentsSection.js

import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ToastNoti from "../toast-noti/ToastNoti"; // Import ToastNoti
import Comment from "./Comment";
import ShowComment from "./ShowComment";

const CommentsSection = ({ initialComments, onSubmitComment, id }) => {
    const [comments, setComments] = useState(initialComments);
    const [showToast, setShowToast] = useState(false); // State để điều khiển việc hiển thị toast
    const [cookies] = useCookies([]);

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${id}/comments`,
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("Comments fetched successfully:", data.message);
                setComments(
                    data.message.sort(
                        (a, b) => new Date(b.createAt) - new Date(a.createAt),
                    ),
                );
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    }, [id]);

    const handleSubmitComment = (comment) => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${id}/comment`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${cookies.accessToken}`,
                },
                credentials: "include",

                body: JSON.stringify({ comment }),
            },
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("Comment added successfully:", data);

                setComments([data.newcomment, ...comments]);
                setShowToast(true); // Hiển thị toast khi bình luận mới được thêm vào

                // Call parent callback if necessary
                onSubmitComment(data.newcomment);

                // Tắt toast sau 3 giây
                setTimeout(() => setShowToast(false), 3000);
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });
    };

    return (
        <div>
            <Comment onSubmitComment={handleSubmitComment} />

            {/* Hiển thị danh sách các bình luận */}
            {comments.map((comment, index) => (
                <ShowComment key={index} ShowComment={comment} />
            ))}

            {/* Hiển thị toast thông báo */}
            {showToast && (
                <ToastNoti
                    message="Your comment has been posted!"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </div>
    );
};

export default CommentsSection;
