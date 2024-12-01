// src/components/CommentsSection.js

import React, { useState } from "react";
import Comment from "./Comment";
import ShowComment from "./ShowComment";
import ToastNoti from "./ToastNoti"; // Import ToastNoti

const CommentsSection = ({ initialComments = [], onSubmitComment }) => {
	const [comments, setComments] = useState(initialComments);
	const [showToast, setShowToast] = useState(false); // State để điều khiển việc hiển thị toast

	const handleSubmitComment = (newCommentContent) => {
		const newComment = {
			username: "Current User",
			content: newCommentContent,
			date: new Date().toISOString(),
		};

		setComments([newComment, ...comments]);
		setShowToast(true); // Hiển thị toast khi bình luận mới được thêm vào

		// Call parent callback if necessary
		onSubmitComment(newComment);

		// Tắt toast sau 3 giây
		setTimeout(() => setShowToast(false), 3000);
	};

	return (
		<div>
			<Comment onSubmitComment={handleSubmitComment} />

			{/* Hiển thị danh sách các bình luận */}
			{comments.map((comment, index) => (
				<ShowComment key={index} comment={comment} />
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
