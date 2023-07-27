import React from 'react'
import {Button, Card, Col, Image, Input, Row, Table, Tag} from "antd";
import {getAPI} from "../../../utils/apiRequest";
import {OVERVIEW_DATA, LOCATION_USER_LIST} from "../../../constants/api";
import InfiniteFeedLoaderButton from "../../../common/InfiniteFeedLoaderButton";
import {displayMessage} from "../../../utils/common";
import {ERROR_MSG_TYPE} from "../../../constants/dataKeys";
import {Link} from "react-router-dom";
import lockr from "lockr";
import {_debounce,} from "../../../utils/lodashUtils";
import Search from "antd/es/input/Search";
import {DatePicker} from 'antd';
import moment from "moment";

class UserHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationData: [],
            location_count: null,
            device_count: null,
            loading: false,
            co2_saved: null,
            inverter_count: null,
            capacity: null,
            location_total: null,
            sortedInfo: null,
            date: moment().format('YYYY-MM-DD'),
            selected_date: null
        }
        this.searchString = _debounce(this.searchString, 500)
    }

    componentDidMount() {
        let token = lockr.get('token')
        // if (token) {
        //     this.loadOverviewInfo()
        //     this.loadLocations();
        // } else {
        //     this.props.history.push('/auth/user/login')
        // }

    }


    loadLocations(page = 1) {
        let that = this;
        const {searchString} = this.state;
        this.setState({
            loading: true
        });
        let successFn = function (data) {
            console.log(data)
            if (data.current === 1) {
                that.setState({
                    location_total: data.count,
                    nextPage: data.next,
                    locationData: data.results,
                    loading: false
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        nextPage: data.next,
                        locationData: [...prevState.locationData, ...data.results],
                        loading: false
                    }
                })
            }
        }
        let errorFn = function (error) {
            that.setState({
                loading: false
            });
            Object.values(error).map(item =>
                displayMessage(ERROR_MSG_TYPE, item)
            );
        }
        let params = {
            page,
            date: this.state.selected_date,
            action_taken: true,
            name__icontains: searchString || undefined
        }
        getAPI(LOCATION_USER_LIST, successFn, errorFn, {...params})
    }

    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    };
    handleChange = (pagination, filters, sorter) => {
        // console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };
    searchString = (value) => {
        this.setState(function (prevState) {
            return {searchString: value}
        }, function () {
            this.loadLocations();
        })
    }
    getTouristLocations = () => {
        const { from, destination } = this.state;

        // Check if both "from" and "destination" are selected
        if (from && destination) {
            // Construct the request body for the API call
            const requestBody = {
                from,
                destination,
            };


            // Make the API call to the ChatGPT server
            fetch('YOUR_CHATGPT_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required headers for your API
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Handle the response from the ChatGPT API
                    console.log(data); // Use the data to update your state or display the results
                    // For example, you could set the response data to a state variable and display it in your component
                    this.setState({ touristLocations: data });
                })
                .catch((error) => {
                    console.error('Error calling ChatGPT API:', error);
                    // Handle any errors that occurred during the API call
                    // For example, you could show an error message to the user
                });
        } else {
            // If either "from" or "destination" is not selected, show an error message
            alert('Please select both "from" and "destination" locations.');
        }
    };

    render() {
        // Rest of the render method...

        return (
            <div style={{ fontFamily: 'Open Sans Reguler', padding: '20px', background: '#92d0c9' }}>
                {/* Single Image */}
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <Image src="/map_graphic.jpg" preview={false} style={{ maxWidth: '100vw'}} />
                </div>
                {/* Form */}
                <Row justify="center" gutter={16}>
                    <Col span={8}>
                        <Input
                            placeholder="From"
                            value={this.state.from}
                            onChange={(e) => this.handleInputChange('from', e.target.value)}
                        />
                    </Col>
                    <Col span={8}>
                        <Input
                            placeholder="Destination"
                            value={this.state.destination}
                            onChange={(e) => this.handleInputChange('destination', e.target.value)}
                        />
                    </Col>
                    <Col span={8}>
                        <Button type="primary" onClick={this.getTouristLocations} style={{ width: '100%' }}>
                            Find Best Places
                        </Button>
                    </Col>
                </Row>
                <br />
                <br />
            </div>
        );
    }
}

export default UserHome;