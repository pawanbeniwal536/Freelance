import React, { useState, useEffect } from "react";
import axios from "axios";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import api from '../../API/index.js'
interface Review {
    stars: number;
    comment: string;
    username: string;
    courseId: string;
}

interface ReviewComponentProps {
    courseId: string;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ courseId }) => {
    const { user } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState<Review>({
        stars: 0,
        comment: "",
        username: "",
        courseId,
    });
    const [popupReview, setPopupReview] = useState<string | null>(null);
    const [showAll, setShowAll] = useState<boolean>(false);

    // Fetch reviews from the API
    useEffect(() => {
        
            api.get(`/api/reviews/${courseId}`)
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                setReviews(data);
            })
            .catch((error) => console.error("Failed to fetch reviews:", error));
    }, [courseId]);

    const toggleStar = (index: number) => {
        setNewReview((prevReview) => ({
            ...prevReview,
            stars: prevReview.stars === index + 1 ? index : index + 1,
        }));
    };

    const handleSubmit = () => {
        if (!newReview.comment.trim()) {
            alert("Please write a comment.");
            return;
        }

            api.post("/api/reviews", {
                ...newReview,
                username: user?.firstName || "Anonymous",
            })
            .then((response) => {
                setReviews((prevReviews) => [response.data, ...prevReviews]);
                setNewReview({ stars: 0, comment: "", username: "", courseId });
            })
            .catch((error) => console.error("Failed to submit review:", error));
    };

    return (
        <div className="p-4 text-white">
            {/* Reviews Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAll ? reviews : reviews.slice(0, 4)).map((review, index) => (
                    <div
                        key={index}
                        className="p-4 bg-navy-950/80 rounded shadow-md text-white"
                    >
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                                <span
                                    key={starIndex}
                                    className={`mr-1 text-lg ${
                                        starIndex < review.stars
                                            ? "text-yellow-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="mt-2 font-bold">{review.username}</p>
                        <p>
                            {review.comment.length > 100 ? (
                                <>
                                    {popupReview === review.comment ? (
                                        <>
                                            {review.comment}
                                            <button
                                                onClick={() => setPopupReview(null)}
                                                className="text-orange-500 underline ml-2"
                                            >
                                                View Less
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {review.comment.slice(0, 100)}...
                                            <button
                                                onClick={() => setPopupReview(review.comment)}
                                                className="text-orange-500 underline ml-2"
                                            >
                                                Read More
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                review.comment
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* View More / View Less Button */}
            {reviews.length > 4 && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded"
                    >
                        {showAll ? "View Less" : "View More"}
                    </button>
                </div>
            )}

            {/* Add Review Section */}
            <div className="mt-8">
                <h3 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-2xl">
                    Add a Review
                </h3>

                <div className="flex flex-col items-center mt-8">
                    <div className="flex justify-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <span
                                key={index}
                                className={`text-lg cursor-pointer ${
                                    index < newReview.stars
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                } p-1 rounded`}
                                onClick={() => toggleStar(index)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        className="w-full h-52 mt-4 p-4 rounded bg-navy-950/80 text-white"
                        placeholder="Write your review..."
                        value={newReview.comment}
                        onChange={(e) =>
                            setNewReview({ ...newReview, comment: e.target.value })
                        }
                    ></textarea>
                    <div className="flex justify-center w-full mt-4">
                        <SignedIn>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded"
                            >
                                Submit
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded">
                                    Submit
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>

            {/* Popup Modal for Full Review */}
            {popupReview && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setPopupReview(null)}
                >
                    <div
                        className="bg-white text-black p-4 rounded shadow-lg max-w-lg w-full overflow-y-auto max-h-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={() => setPopupReview(null)}
                        >
                            X
                        </button>
                        <p>{popupReview}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewComponent;
