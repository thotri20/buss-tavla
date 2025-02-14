// src/app/page.tsx
import Tavle from "./components/Tavle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-800 drop-shadow-md">
        🚌 Buss tavle
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6">
        <Tavle />
      </div>
    </div>
  );
}
