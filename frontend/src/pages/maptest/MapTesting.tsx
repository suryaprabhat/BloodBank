import ArcGISMap from "../../components/leaflet/LeafletMap";
import { hospitalMockData } from "@/data/hospitalMockData";

function Map() {
    const handleSelectLocation = (location: { lat: number; lng: number; placeName: string }) => {
        console.log("Selected location:", location);
    };

    return (
        <div className="w-full h-screen">
            <ArcGISMap
                onSelectLocation={handleSelectLocation}
                hospitalLocations={hospitalMockData}
            />
        </div>
    )
}
export default Map