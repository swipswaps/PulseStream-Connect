
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-20">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            PulseStream Connect
          </span>
        </h1>
        <p className="text-gray-400 mt-1">Your Interactive PulseAudio Network Guide</p>
      </div>
    </header>
  );
};

export default Header;
