import React, { useState, useEffect } from 'react';

const AnimatedCircularProgress = ({ percentage = 68, label = "Budget", size = 200, strokeWidth = 20, duration = 2000 }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  
  useEffect(() => {
    let startTime = null;
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      const easedProgress = easeOutCubic(progressRatio);
      const percentage_progress = easedProgress * percentage;
      
      setCurrentPercentage(percentage_progress);
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCurrentPercentage(percentage);
      }
    };
    
    requestAnimationFrame(animate);
  }, [percentage, duration]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentPercentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4169E1"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'none'
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: '600', color: '#333' }}>
          {Math.floor(currentPercentage)}%
        </div>
        <div style={{ fontSize: '1.2rem', color: '#666', marginTop: '0.5rem' }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCircularProgress;