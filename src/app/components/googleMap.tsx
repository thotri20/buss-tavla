import { GoogleMap, InfoBox, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { fetchPositions, Vehicle } from "../utils/fetchPosition";
import { AnimatedMarker } from "../components/AnimatedMarker";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 60.806,
  lng: 11.053,
};

const lightModeStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
];

const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function BusMapGoogle({ lineRef }: { lineRef: string }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedBus, setSelectedBus] = useState<Vehicle | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPositions();
      setVehicles(data);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return null;

  const filteredVehicles = vehicles.filter(
    (bus) => bus.publicCode === lineRef
  );

  const options = {
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeControl: true,
    styles: darkMode ? darkModeStyle : lightModeStyle,
  };

  return (
    <>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          right: 10,
          padding: "10px 20px",
          backgroundColor: darkMode ? "#444" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Lys modus" : "Mørk modus"}
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={options}
      >
        {filteredVehicles.map((bus, index) => (
          <AnimatedMarker
            key={`${bus.lineRef}-${bus.latitude}-${bus.longitude}-${index}`}
            position={{ lat: bus.latitude, lng: bus.longitude }}
            label={undefined}
            onClick={() => setSelectedBus(bus)}
          />
        ))}

        {selectedBus && window.google && (
          <InfoBox
            position={new window.google.maps.LatLng(
              selectedBus.latitude,
              selectedBus.longitude
            )}
            options={{ closeBoxURL: "", enableEventPropagation: true }}
          >
            <div
              style={{
                backgroundColor: darkMode ? "#2c2f4a" : "#fff",
                padding: "15px 20px",
                borderRadius: "14px",
                color: darkMode ? "white" : "black",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                boxShadow: darkMode
                  ? "0 6px 15px rgba(0, 0, 0, 0.7)"
                  : "0 6px 15px rgba(0, 0, 0, 0.2)",
                maxWidth: "240px",
                border: darkMode ? "1px solid #555" : "1px solid #ccc",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "22px",
                  marginBottom: "10px",
                  color: darkMode ? "#bbb" : "#444",
                }}
                onClick={() => setSelectedBus(null)}
              >
                ×
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: darkMode ? "#90caf9" : "#1976d2",
                }}
              >
                Buss {selectedBus.publicCode}
              </h2>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "16px",
                  color: darkMode ? "#bbdefb" : "#0d47a1",
                  fontWeight: "500",
                }}
              >
                Linje-ID: {selectedBus.lineRef}
              </p>
            </div>
          </InfoBox>
        )}
      </GoogleMap>
    </>
  );
}
  