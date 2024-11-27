
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaCog, FaTrash } from 'react-icons/fa';

import Sidebar from '../../sidebar/Sidebar';
import EditUserForm from './EditUserForm';

import './userList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState();
    const [showEditForm, setShowEditForm] = useState(false);

    const token = Cookies.get("accessTokenFront");

    const statusNameMap = {
        "DELETED": "Usunięty",
        "ACTIVE": "Aktywny",
        "SUSPENDED": "Zablokowany",
    };
    const roleNameMap = {
        "USER": "Użytkownik",
        "ADMIN": "Administrator"
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/all", {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, size },
            });
            setUsers(response.data.content);
            setTotalPages(response.data.page.totalPages);
        } catch (e) {
            console.error('Error fetching users:', e);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size]);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`Usunięto użytkownika o ID: ${userId}`);
            fetchUsers(); // Odśwież listę użytkowników
        } catch (e) {
            console.error("Błąd podczas usuwania użytkownika: ", e);
        }
    };

    const handleEditUser = async (formData) => {
        if (!currentUser) return;
        try {
            await axios.patch(`http://localhost:8080/api/users/${currentUser.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`Edytowano użytkownika: ${currentUser.username}`);
            setShowEditForm(false); // Zamknij modal
            fetchUsers(); // Odśwież listę użytkowników
        } catch (e) {
            console.error(`Błąd podczas edytowania użytkownika: `, e);
        }
    };

    const renderStatusIndicator = (status) => {
        const statusColorMap = {
            "DELETED": "red",
            "ACTIVE": "green",
            "SUSPENDED": "gold",
        };
        return (
            <div className="d-flex align-items-center">
                <span
                    style={{
                        backgroundColor: statusColorMap[status],
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        marginRight: "8px",
                    }}
                ></span>
                {statusNameMap[status]}
            </div>
        );
    };

    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                <Col md={9}>
                    <div className="main-content">
                        {/* Modal edycji */}
                        {currentUser && (
                            <Modal
                            show={showEditForm}
                            onHide={() => setShowEditForm(false)}
                            centered
                            size="lg"
                            backdrop="true"
                            className="d-flex flex-column p-0 m-0"
                          >
                                <Modal.Body className="d-flex flex-column p-0">
                                    <EditUserForm
                                        onSubmit={handleEditUser}
                                        editedData={currentUser}
                                        roles={roleNameMap}
                                        statuses={statusNameMap}
                                    />
                                </Modal.Body>
                            </Modal>
                        )}

                        <nav class="navbar navbar-light justify-content-between">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                            </form>
                        </nav>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Użytkownik</th>
                                    <th>Data utworzenia</th>
                                    <th>Rola</th>
                                    <th>Status</th>
                                    <th>Opcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td></td>
                                        <td>{user.username || "-"}</td>
                                        <td>{format(new Date(user.createdAt), 'dd.MM.yyyy')}</td>
                                        <td>{roleNameMap[user.role]}</td>
                                        <td>{renderStatusIndicator(user.status)}</td>
                                        <td>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setCurrentUser(user);
                                                    setShowEditForm(true);
                                                }}
                                                title="Edytuj użytkownika"
                                            >
                                                <FaCog color="#2F7A7E"/>
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() => handleDeleteUser(user.id)}
                                                title="Usuń użytkownika"
                                            >
                                                <FaTrash color="red" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};


export default UserList;
