import React, { useState } from 'react';

const CustomSwitch = ({ defaultChecked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const toggleSwitch = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) onChange(newState);
  };

  return (
    <div 
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 cursor-pointer ${isChecked ? 'bg-white border-2 border-orange-500' : 'bg-white border-2 border-orange-500'}`}
      onClick={toggleSwitch}
    >
      <span 
        className={`absolute left-0 inline-block  w-5 h-5 transform transition-transform duration-200 rounded-full ${isChecked ? 'translate-x-6 bg-orange-500' : 'translate-x-1 bg-orange-500'}`}
      />
    </div>
  );
};

export default CustomSwitch;
