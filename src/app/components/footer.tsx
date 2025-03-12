import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000000] text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FluktRuter™. All rights reserved.</p>
        <nav className="flex space-x-4 mt-4 md:mt-0">
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
