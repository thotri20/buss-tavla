import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/fluktruter.png"; // Bytt til din logo

const LogoAnimation = ({ onFinish }: { onFinish: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish(); // Kaller onFinish når animasjonen er ferdig
    }, 2000); // Juster tid etter behov
    return () => clearTimeout(timer); // Rydder opp ved komponent unmount
  }, [onFinish]);

  return show ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Image
        src={logo}
        alt="Logo"
        width={200}
        height={200}
        className="animate-zoom"
      />
    </div>
  ) : null;
};

export default LogoAnimation;
