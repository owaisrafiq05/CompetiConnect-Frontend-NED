import React from "react";

const Title = ({ title, subtitle }) => {
  return (
    <div className="text-center my-4 mt-20 mb-8">
      <p className="text-sm sm:text-base font-medium uppercase text-gray-800 tracking-widest">
        {subtitle}
      </p>
      <h2 className="text-lg sm:text-2xl md:text-4xl font-bold text-gray-900 mt-1">
        {title}
      </h2>
    </div>
  );
};

export default Title;
