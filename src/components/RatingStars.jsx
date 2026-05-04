import React, { useState, useEffect } from 'react';
import { ratingService } from '../services/rating.service.js';

const RatingStars = ({ contentId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const savedRating = await ratingService.getRating(contentId);
      setRating(savedRating);
    };
    fetchRating();
  }, [contentId]);

  const handleRate = async (e, value) => {
    e.stopPropagation(); // Evita dar play no filme ao clicar na estrela
    setRating(value);
    try {
      await ratingService.saveRating(contentId, value);
    } catch (error) {
      console.error('Falha ao salvar nota:', error);
    }
  };

  return (
    <div className="flex items-center gap-0.5 mt-1" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`transition-all duration-300 transform hover:scale-125 focus:outline-none`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => handleRate(e, star)}
        >
          <svg
            className={`w-4 h-4 ${
              star <= (hover || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-zinc-600 fill-none'
            } transition-colors duration-200`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {rating > 0 && !hover && (
        <span className="text-[10px] text-zinc-500 ml-1 font-bold animate-fade-in">{rating}/5</span>
      )}
    </div>
  );
};

export default RatingStars;
