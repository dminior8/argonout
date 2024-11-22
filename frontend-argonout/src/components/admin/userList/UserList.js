import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Cookie from 'js-cookie';
import axios from 'axios';

import Sidebar from '../../sidebar/Sidebar';
import MiniStats from '../../miniStats/MiniStats';

const UserList = () => {
    return(
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                
                <Col md={6}>
                    <div className="main-content">
                        </div>
                </Col>
                
                <Col md={3}>
                    <div className="right-container">
                        <MiniStats className="right-top-container" />
                        
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default UserList;