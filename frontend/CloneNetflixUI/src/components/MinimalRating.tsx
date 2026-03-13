import React from 'react';
import { Star } from 'lucide-react';

interface MinimalRatingProps {
  average: number;
  userRating?: number;
  onRate?: (val: number) => void;
  editable?: boolean;
}

const MinimalRating: React.FC<MinimalRatingProps> = ({ average, userRating, onRate, editable }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-yellow-400">{average.toFixed(1)}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            className={editable ? 'group' : ''}
            onClick={() => editable && onRate && onRate(star)}
            aria-label={`Rate ${star}`}
          >
            <Star
              className={`transition-colors duration-200 ${userRating && userRating >= star ? 'text-yellow-400' : 'text-gray-400'} ${editable ? 'group-hover:text-yellow-300' : ''}`}
              style={{ width: 22, height: 22 }}
              fill={userRating && userRating >= star ? '#facc15' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {userRating && (
        <span className="ml-2 text-xs text-gray-400">({userRating}/5)</span>
      )}
    </div>
  );
};

export default MinimalRating;
