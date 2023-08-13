import React from 'react';

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waypoints: [
                { latitude: 37.7749, longitude: -122.4194 }, // Example values
                { latitude: 34.0522, longitude: -118.2437 }, // Example values
                // Add more waypoints as needed
            ],
        };
    }

    componentDidMount() {
        // Load Google Maps API asynchronously
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        window.initMap = this.initMap;
    }

    initMap = () => {
        const { waypoints } = this.state;

        // Create a map instance
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: waypoints[0].latitude, lng: waypoints[0].longitude }, // Center the map at the first waypoint
            zoom: 8, // Default zoom level
        });

        // Display directions between waypoints
        if (waypoints.length >= 2) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const origin = new window.google.maps.LatLng(waypoints[0].latitude, waypoints[0].longitude);
            const destination = new window.google.maps.LatLng(waypoints[1].latitude, waypoints[1].longitude);

            const request = {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Error fetching directions:', status);
                }
            });
        }
    };

    render() {
        return (
            <div style={{ fontFamily: 'Open Sans Reguler', padding: '20px', background: '#92d0c9' }}>
                {/* Map container */}
                <div id="map" style={{ width: '100%', height: '400px' }}></div>
            </div>
        );
    }
}

export default MapView;
