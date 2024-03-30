import React from 'react';

interface RatingButtonProps {
  week: number;
  isSelected: boolean;
  onSelect: (rating: number) => void;
}

const RatingButton: React.FC<RatingButtonProps> = ({ week, isSelected, onSelect }) => {
  return (
    <button
      style={{
        backgroundColor: isSelected ? '#85a1f3' : 'transparent',
        color: 'black',
        height: '40px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(week)}>
      <h6 style={{
        margin: '0',
        padding: '0',
        color: isSelected ? 'white' : 'grey',
      }}>Week {week}</h6>
    </button>
  );
};

export default RatingButton;
