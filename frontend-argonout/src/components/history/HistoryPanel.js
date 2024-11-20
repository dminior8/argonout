import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import './HistoryPanel.css';

const HistoryPanel = () => {
    return(
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                
                <Col md={5}>
                    <div className="main-content">
                        <div className="history-label">Odwiedzone miejsca</div>
                        <div className="history-list">
                            {messageList.map((singleMessage, index) => (
                                <div className="single-record" key={index} onClick={() => handleCurrentMessageChange(singleMessage)}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="history-name">{singleMessage.topic}</div>
                                        <button 
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Zapobiegaj propagacji kliknięcia
                                                deleteMessage(singleMessage.id);
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#D1D1D1",
                                                justifyContent:"center"
                                            }}
                                        >
                                            <FaTimes /> 
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div className="history-desc">
                                            {singleMessage.content
                                                ? singleMessage.content.length > 60 
                                                    ? `${singleMessage.content.slice(0, 60)}...` 
                                                    : singleMessage.content
                                                : "Brak treści"}
                                        </div>
                                        <span className="dot-divider" style={{ margin: "0 4px", opacity: "0.5" }}>•</span>
                                        <div className="-time" style={{ opacity: "0.5" }}>
                                            {formatMessageDate(singleMessage.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                
                <Col md={4}>
                    <div className="right-container">
                        <MiniStats className="right-top-container" />
                        <div className="map-content">
                            <BasicMap/>         
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );

}

export default HistoryPanel;