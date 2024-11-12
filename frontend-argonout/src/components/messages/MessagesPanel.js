import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import Cookies from "js-cookie";
// import axios from "axios";

import "./messagesPanel.css";

import { useUser } from '../../contexts/UserContext';
import Sidebar from "../sidebar/Sidebar";
import MiniStats from "../miniStats/MiniStats";

const LeaderboardPanel = () => {

    return(
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                <Col md={6}>
                    <div className="main-content">
                        <div className="message-label">
                            Napisz do nas
                        </div>
                        <div className="message-form">
                            <input
                                className="text-input-title"
                                type="text"
                                name="topic"
                                placeholder="Temat wiadomości"
                                style={{minHeight:"3rem"}}
                                //value={formData.name}
                                //onChange={handleInputChange}
                                required
                            />
                            <textarea
                                className="text-input-description"
                                type="text"
                                name="description"
                                placeholder="Opis problemu"
                                style={{minHeight:"20rem", fontSize:"1rem"}}
                                // value={formData.description}
                                //onChange={}
                                required
                            />
                            <button
                                className="btn-send"
                                type="submit"
                                id="SendMessageButton"
                                name="SendMessageButton"
                            >
                                Wyślij
                            </button>
                        </div>
                        
                    </div>
                </Col>
                <Col md={3}>
                    <MiniStats/>
                </Col>
            </Row>
        </Container>
    );
}

export default LeaderboardPanel;