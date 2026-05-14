import React from 'react';

const Loadingscreen = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="refcore-loader" aria-label="Loading">
        <span className="refcore-piece p1"></span>
        <span className="refcore-piece p2"></span>
        <span className="refcore-piece p3"></span>
        <span className="refcore-piece p4"></span>
        <span className="refcore-piece p5"></span>
        <span className="refcore-piece p6"></span>
      </div>
    </div>
  );
};

export default Loadingscreen;
