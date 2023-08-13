import React from 'react';
import {Avatar, Button, Card, Col, Divider, Form, Input, Popconfirm, Row, Space, Table} from "antd";
import {DEVICE_DETAIL, GOOGLE_KEY, USER, USER_PASSWORD_CHANGE} from "../../../constants/api";
import {getAPI, postAPI} from "../../../utils/apiRequest";
import {UserOutlined} from "@ant-design/icons";
import {displayMessage, interpolate} from "../../../utils/common";
import lockr from "lockr";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            google_key : GOOGLE_KEY,
            waypoints: [
                { latitude: 37.7749, longitude: -122.4194 }, // Example values
                { latitude: 34.0522, longitude: -118.2437 }, // Example values
                // Add more waypoints as needed
            ],
        };
    }

    componentDidMount() {
        this.processSelectedLocations();
        // Load Google Maps API asynchronously
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=`+ this.state.google_key +`&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        window.initMap = this.initMap;
    }
    processSelectedLocations() {
        const selectedLocations = lockr.get('selectedLocations') || [];
        console.log(selectedLocations)
        const waypoints = selectedLocations.map(location => ({
            latitude: location.latitude,
            longitude: location.longitude,
        }));
        this.setState({ waypoints });
    }
    initMap = () => {
        const { waypoints } = this.state;

        // Create a map instance
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: waypoints[0].latitude, lng: waypoints[0].longitude },
            zoom: 8,
        });

        // Display directions between all waypoints
        if (waypoints.length >= 2) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const origin = new window.google.maps.LatLng(waypoints[0].latitude, waypoints[0].longitude);
            const destination = new window.google.maps.LatLng(waypoints[waypoints.length - 1].latitude, waypoints[waypoints.length - 1].longitude);

            const waypointsForDirections = waypoints.slice(1, waypoints.length - 1).map(waypoint => ({
                location: new window.google.maps.LatLng(waypoint.latitude, waypoint.longitude),
                stopover: true
            }));

            const request = {
                origin,
                destination,
                waypoints: waypointsForDirections,
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

export default UserProfile;





