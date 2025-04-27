import ArcGISMap from "../../components/leaflet/LeafletMap";

function Map() {
    const handleSelectLocation = (location: { lat: number; lng: number; placeName: string }) => {
        console.log("Selected location:", location);
    };

    return (
        <>
            <ArcGISMap onSelectLocation={handleSelectLocation} />
        </>
    )
}
export default Map