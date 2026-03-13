import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ value, onChange, size = 36 }) => {
  return (
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="group"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star}`}
        >
          <Star
            className={`transition-colors duration-200 ${value >= star ? 'text-yellow-400' : 'text-gray-500'} group-hover:text-yellow-300`}
            style={{ width: size, height: size }}
            fill={value >= star ? '#facc15' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
