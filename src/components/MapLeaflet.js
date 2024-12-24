import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Container } from "react-bootstrap";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapLeaflet() {
    const mapRef = useRef(null);
    const position = [51.505, -0.09]; // Default position for the map
    const markers = [
        { position: [51.505, -0.09], popup: "Marker 1" },
        { position: [51.515, -0.1], popup: "Marker 2" },
        { position: [51.505, -0.095], popup: "Marker 1" },
        { position: [51.515, -0.11], popup: "Marker 2" },
    ];

    return (
        <Container
            className="d-flex
                align-items-center
                justify-content-center"
        >
            <MapContainer
                ref={mapRef}
                center={position}
                zoom={13}
                style={{ height: "50vh", width: "50%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerClusterGroup>
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.position}>
                            <Popup>{marker.popup}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </Container>
    );
}

export default MapLeaflet;
