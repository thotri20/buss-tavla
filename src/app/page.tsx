import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/buss3.jpg')", // Sti til bakgrunnsbildet
        }}
      >
        <div>{/* Legg til annet innhold her */}</div>
      </div>
    </div>
  );
}
