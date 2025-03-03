import Tavle from "../components/Tavle";
import Tavle2 from "../components/Tavle2";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 p-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-blue-900 drop-shadow-lg">
        Fluktruter
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 flex">
        <Tavle2/>
        <Tavle/>
      </div>
    </div>
  );
}
