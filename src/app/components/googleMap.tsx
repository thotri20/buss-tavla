import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type Props = {
  busPosition: { lat: number; lng: number };
  stopPosition: { lat: number; lng: number };
  containerStyle?: { width: string; height: string };
};

const defaultContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function GoogleMapWrapper({
  busPosition,
  stopPosition,
  containerStyle = defaultContainerStyle,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={busPosition}
      zoom={16}
      options={options}
    >
      <Marker
        position={busPosition}
        label="🚌"
        title="Bussens posisjon"
      />
      <Marker
        position={stopPosition}
        label="🚏"
        title="Holdeplass"
      />
    </GoogleMap>
  );
}
