"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/googleMap"), {
  ssr: false,
});

export default function MapTest() {
  return (
    <main>
      <Map />
    </main>
  );
}
