import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { fetchPositions, Vehicle } from '../utils/fetchPosition';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
    lat: 60.806,
    lng: 11.053,
};

export default function BusMapGoogle() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

useEffect(() => {
  const load = async () => {
    const data = await fetchPositions();
    setVehicles(data);
  };

  load();
  const interval = setInterval(load, 15000); // every 15s
  return () => clearInterval(interval);
}, []);

  if (!isLoaded) return <p>Laster kart...</p>

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
      {vehicles.map((bus) =>(
        <Marker
          key={bus.lineRef}
          position={{ lat: bus.latitude, lng: bus.longitude }}
          label={bus.publicCode}
          title={`line ${bus.publicCode}`}
          />
          
      ))}

    </GoogleMap>

    
  )
}
