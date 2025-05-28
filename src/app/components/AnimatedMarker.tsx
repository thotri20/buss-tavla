import { useEffect, useMemo, useRef } from "react";
import { MarkerF } from "@react-google-maps/api";

type Props = {
  position: google.maps.LatLngLiteral;
  label?: string; // bare string
  title?: string;
  onClick?: () => void;
  icon?: google.maps.Icon | string; // legg til icon som prop
};

export function AnimatedMarker({
  position,
  label,
  title,
  onClick,
  icon,
}: Props) {
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Hvis ingen icon prop sendes, bruk default icon
  const defaultIcon = useMemo(() => {
    if (typeof window === "undefined" || !window.google?.maps) return undefined;
    return {
      url: "/innlandstraffikk.png", // ditt bussikon som default
      scaledSize: new window.google.maps.Size(40, 40),
    };
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(position);
      if (label) {
        markerRef.current.setLabel(label); // dette krever at label er string
      }
    }
  }, [position, label]);

  return (
    <MarkerF
      position={position}
      title={title}
      icon={icon ?? defaultIcon} // Bruk icon fra prop, eller default
      onLoad={(marker) => {
        markerRef.current = marker;
      }}
      onClick={onClick}
    />
  );
}
