import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import Cookies from 'js-cookie';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";

import Sidebar from "./../sidebar/Sidebar";
import BasicMap from "./../map/BasicMap";
import MiniStats from './../miniStats/MiniStats';

import './historyPanel.css';

const HistoryPanel = () => {
    const [places, setPlaces] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(2);
    const [currentPlace, setCurrentPlace] = useState(null);
    
    const handlePlaceClick = (placeId) => {
        setCurrentPlace(placeId);
    }

    const fetchMorePlaces = async () => {
        try {
            const token = Cookies.get('accessTokenFront');
            const response = await axios.get(`http://localhost:8080/api/places/visited`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: { index, size: 2 },
            });
            setPlaces((prevItems) => [...prevItems, ...response.data.content]);
            response.data.length > 0 ? setHasMore(true) : setHasMore(false);
        } catch (error) {
          console.error('Error during places fetching: ', error);
        }
        setIndex((prevIndex) => prevIndex + 1);
      };

      useEffect(() => {
        fetchMorePlaces();
      }, []);

    return(
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                
                <Col md={5}>
                    <div className="main-content">
                        <div className="history-label">Odwiedzone miejsca</div>
                        <InfiniteScroll
                            dataLength={places.length}
                            next={fetchMorePlaces}
                            hasMore={hasMore}
                            loader={<h3 style={{color:"#D1D1D1"}}>Ładowanie...</h3>}
                            scrollableTarget="history-list"
                        >
                            <div className="history-list">
                                {places.map((place, index) => (
                                    <div className="single-record" key={`${place.placeId}-${index}`}  onClick={() => handlePlaceClick(place.placeId)}>
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection:"column" }}>
                                            <div className="history-name">{place.name}</div>
                                            <div className="other-history-info">
                                                {(!place.routeName || place.routeName === "Unknown Route") ? "Inna • " : place.routeName + " • "}
                                                {place.visitedAt + " • "}
                                                <span className="description">
                                                    {place.description}   
                                                </span>
                                            </div>
                                            
                                        </div>

                                        
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </Col>
                
                <Col md={4}>
                    <div className="right-container">
                        <MiniStats className="right-top-container" />
                        <div className="map-content">
                            <BasicMap 
                                className="basic-map" 
                                places={places}
                                currentPlace={currentPlace}
                            />         
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );

}

export default HistoryPanel;