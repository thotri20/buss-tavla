"use client";
import dynamic from "next/dynamic";
import BusMapGoogle from "../components/googleMap";

const Map = dynamic(() => import("../components/googleMap"), {
    ssr: false,
});

export default function MapTest() {
    return (
        <main>
            <h1>busser</h1>
            <BusMapGoogle/>
        </main>
    )
}