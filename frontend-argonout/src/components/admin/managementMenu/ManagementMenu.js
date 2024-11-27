import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { FaUsers, FaEnvelope, FaMapMarkedAlt } from 'react-icons/fa';
import { useUser } from '../../../contexts/UserContext';
import './managementMenu.css';
import Sidebar from '../../sidebar/Sidebar';

const ManagementMenu = () => {
  const { user } = useUser();

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row>
        <Col md={3}>
          <Sidebar />
        </Col>
        <Col md={9}>
          <div className="main-content">
            <div className="management-label">Panel zarządzania</div>
            <Row className="management-menu">
              <Col md={4} className="mb-4">
                <Card className="menu-card">
                  <Link to={`/management/users`} style={{ textDecoration: 'none' }}>
                    <Card.Body>
                      <FaUsers className="menu-icon" />
                      <Card.Title>Użytkownicy</Card.Title>
                      <Card.Text>
                        Zarządzaj wszystkimi użytkownikami.
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className="menu-card">
                  <Link to={`/management/messages`} style={{ textDecoration: 'none' }}>
                    <Card.Body>
                      <FaEnvelope className="menu-icon" />
                      <Card.Title>Wiadomości</Card.Title>
                      <Card.Text>
                        Przejdź do panelu wiadomości.
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
                <Card className="menu-card">
                  <Link to={`/management/routes`} style={{ textDecoration: 'none' }}>
                    <Card.Body>
                      <FaMapMarkedAlt className="menu-icon" />
                      <Card.Title>Miejsca</Card.Title>
                      <Card.Text>
                        Zarządzaj miejscami w systemie.
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagementMenu;
