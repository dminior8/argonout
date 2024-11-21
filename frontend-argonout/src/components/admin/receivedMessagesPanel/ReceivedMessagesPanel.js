import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import { FaTimes } from "react-icons/fa";  // Importowanie ikony kosza

import Sidebar from "../../sidebar/Sidebar";
import MiniStats from "../../miniStats/MiniStats";

import "./receivedMessagesPanel.css";

const ReceivedMessagesPanel = () => {
    const [messageList, setMessageList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [currentMessage, setCurrentMessage] = useState();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = Cookies.get('accessTokenFront');
                const response = await axios.get('http://localhost:8080/api/messages/get/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { page, size: 7 },
                });
                setTotalPages(response.data.page.totalPages);
                setMessageList(response.data.content);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        
        fetchMessages();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage); 
        }
    };

    const handleCurrentMessageChange = (newMessage) => {
        setCurrentMessage(newMessage);
    }

    const formatMessageDate = (dateString) => {
        const date = new Date(dateString); // Tworzymy obiekt Date z daty wiadomości
        const now = new Date(); // Bieżąca data
    
        // Sprawdzamy, czy data jest z dzisiaj
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        } 
        // Sprawdzamy, czy data jest z tego samego roku
        else if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
        } 
        // Jeśli data jest z innego roku
        else {
            return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' });
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const token = Cookies.get('accessTokenFront');
            await axios.delete(`http://localhost:8080/api/messages/${messageId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });


            setMessageList((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                
                <Col md={6}>
                    <div className="main-content">
                        <div className="messages-label">Otrzymane wiadomości</div>
                        <div className="messages-list">
                            {messageList.map((singleMessage, index) => (
                                <div className="single-message" key={index} onClick={() => handleCurrentMessageChange(singleMessage)}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="message-topic">{singleMessage.topic}</div>
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
                                        <div className="message-content">
                                            {singleMessage.content
                                                ? singleMessage.content
                                                : "Brak treści"}
                                        </div>
                                        <span className="dot-divider" style={{ margin: "0 4px", opacity: "0.5" }}>•</span>
                                        <div className="message-time" style={{ opacity: "0.5" }}>
                                            {formatMessageDate(singleMessage.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button className="pagination-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                                    Poprzednia
                                </button>
                                <span>{page + 1} z {totalPages}</span>
                                <button className="pagination-btn" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                                    Następna
                                </button>
                            </div>
                        )}
                    </div>
                </Col>
                
                <Col md={3}>
                    <div className="right-container">
                        <MiniStats className="right-top-container" />
                        <div className="message-description">
                            <div className="message-topic-desc" style={{ color: "#D1D1D1" }}>
                                {currentMessage ? currentMessage.topic : "N/A"}
                            </div>
                            <div className="sender-data">
                                <div>
                                    {currentMessage ? currentMessage.senderEmail	 : ""}
                                </div>  
                            </div>  
                            <div className="message-content-desc">
                                {currentMessage ? currentMessage.content : ""}
                            </div>     
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ReceivedMessagesPanel;
