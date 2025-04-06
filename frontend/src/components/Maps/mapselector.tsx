import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for missing marker icons
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationSelector = ({ onSelectLocation }: { onSelectLocation: (location: { lat: number; lng: number }) => void }) => {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng);
    },
  });
  return null;
};

const MapSelector = ({ selectedLocation, setSelectedLocation }: any) => {
  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='© OpenStreetMap contributors'
      />
      <LocationSelector onSelectLocation={setSelectedLocation} />
      {selectedLocation && <Marker position={selectedLocation} />}
    </MapContainer>
  );
};

export default MapSelector;
