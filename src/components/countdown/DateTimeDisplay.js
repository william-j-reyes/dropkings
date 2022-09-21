import React from 'react';
import './DateTimeDisplay.css';

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div>
      <p className={`value-${isDanger}`}>{value}</p>
      <span className='type'>{type}</span>
    </div>
  );
};

export default DateTimeDisplay;
