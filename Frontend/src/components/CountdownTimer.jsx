// client/src/components/CountdownTimer.js
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialMinutes }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
        // You might want to add a callback here to notify parent component
        window.location.reload(); // Force refresh when timer ends
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <div className="text-center my-4">
      <p className="text-lg text-gray-700">You can claim another coupon in:</p>
      <div className="text-3xl font-bold text-blue-600">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default CountdownTimer;