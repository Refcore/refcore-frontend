import React from 'react';
import CompanyLogo from '../shared/CompanyLogo';

const Loadingscreen = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <CompanyLogo
        width={130}
        height={40}
        noText
        className="hidden lg:block animate-pulse"
      />
      <CompanyLogo
        width={80}
        height={40}
        noText
        className="lg:hidden animate-pulse"
      />
    </div>
  );
};

export default Loadingscreen;
