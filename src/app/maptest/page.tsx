"use client";
import dynamic from "next/dynamic";

const GoogleMapsWrapper = dynamic(() => import("../components/googleMap"), {
  ssr: false,
});

export default function MapTest() {
  return (
    <main>
      <GoogleMapsWrapper />
    </main>
  );
}
