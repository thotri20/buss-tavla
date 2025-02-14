// src/pages/index.tsx
import Tavle from "../components/Tavle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Entur Tavle</h1>
      <Tavle />
    </div>
  );
}
