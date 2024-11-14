import React, {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

import "./messagesPanel.css";

import Sidebar from "../sidebar/Sidebar";
import MiniStats from "../miniStats/MiniStats";

const LeaderboardPanel = () => {
    const [formData, setFormData] = useState({
        topic: '',
        content: ''
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        try {
            const token = Cookies.get('accessTokenFront');
            const response = await axios.post('http://localhost:8080/api/messages/send', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            alert(`${response.data.message}`);
            window.location.reload(true);
          } catch (error) {
            console.error('Error during logout:', error);
          }
    }
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
                            <form onSubmit={handleSendMessage}>
                                <input
                                    className="text-input-title"
                                    type="text"
                                    name="topic"
                                    placeholder="Temat wiadomości"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    style={{minHeight:"3rem"}}
                                    required
                                />
                                <textarea
                                    className="text-input-description"
                                    type="text"
                                    name="content"
                                    placeholder="Opis problemu"
                                    value={formData.content}
                                    onChange={handleChange}
                                    style={{minHeight:"20rem", fontSize:"1rem"}}
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
                            </form>
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