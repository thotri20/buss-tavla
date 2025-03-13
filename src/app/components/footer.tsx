import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#807b7b] text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>Ringata 235</p>
          <p>2315 HAMAR</p>
          <p>Telefon: 411 82 116</p>
          <p>E-post: fluktruter@gmail.com</p>
        </div>  
        <p className="text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} FluktRuter™. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
