import React, { useState } from 'react';
import { Spinner, StarIcon } from './icons';

const ReviewSubmissionForm: React.FC = () => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!review) return;
        setStatus('submitting');
        setTimeout(() => {
            setStatus('submitted');
            setTimeout(() => {
                // Reset form after showing success message
                setStatus('idle');
                setRating(5);
                setReview('');
            }, 3000);
        }, 1000);
    };

    return (
        <div className="mt-16 max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
            {status === 'submitted' ? (
                <div className="text-center">
                    <h3 className="text-2xl font-playfair text-green-400">Thank You!</h3>
                    <p className="mt-2 text-gray-300">Your feedback is greatly appreciated.</p>
                </div>
            ) : (
                <>
                    <h3 className="text-3xl font-playfair text-center mb-6">Leave a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium text-gray-300 text-center mb-2">
                                Your Rating
                            </label>
                            <div className="flex justify-center mb-4 space-x-2">
                                {[...Array(5)].map((_, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <button type="button" key={i} onClick={() => setRating(ratingValue)} aria-label={`${ratingValue} star rating`}>
                                            <StarIcon 
                                                className={`w-8 h-8 cursor-pointer transition-colors ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`} 
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                aria-label="Star rating slider"
                            />
                        </div>

                        <div>
                            <label htmlFor="review-text" className="block text-sm font-medium text-gray-300">
                                Your Review
                            </label>
                            <textarea
                                id="review-text"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={4}
                                required
                                placeholder="Tell us about your experience..."
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting' || !review}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? (
                                <>
                                    <Spinner className="w-6 h-6 mr-2" />
                                    Submitting...
                                </>
                            ) : 'Submit Review'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default ReviewSubmissionForm;
