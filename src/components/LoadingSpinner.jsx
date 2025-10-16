import React from 'react';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]">
    <div className="flex space-x-2">
      <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce"></div>
      <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-5 h-5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

export default LoadingSpinner;
