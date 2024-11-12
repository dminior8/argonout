import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

import "./leaderboardPanel.css";

import { useUser } from '../../contexts/UserContext';
import Sidebar from "../sidebar/Sidebar";
import MiniStats from "../miniStats/MiniStats";

const LeaderboardPanel = () => {
    const { user, setUser } = useUser();
    const [leaguesData, setLeaguesData] = useState([]);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [userList, setUserList] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [page, setPage] = useState(0);
    const [position, setPosition] = useState("..."); 

    const token = Cookies.get('accessTokenFront');

    const fetchLeagues = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/leagues/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaguesData(response.data);
        } catch (e) {
            console.error('Error fetching leagues:', e);
        }
    };

    useEffect(() => {
        fetchLeagues();
    }, []);

    useEffect(() => {
        if (leaguesData.length > 0 && user && (!currentLeague || currentLeague.id !== user.league?.id)) {
            const league = leaguesData.find(
                league => league.minPoints <= user.points && league.maxPoints >= user.points
            );
            if (league && (!user.league || user.league.id !== league.id)) {
                setCurrentLeague(league);
                setUser(prevUser => ({ ...prevUser, league })); 
            }
        }
    }, [leaguesData, user, currentLeague, setUser]);

    useEffect(()=>{
        const fetchUsersFromLeague = async () => {
            try {
                const token = Cookies.get('accessTokenFront');
                const response = await axios.get("http://localhost:8080/api/leagues/current-player/position", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    
                });
                setPosition(response.data);
                
            } catch (e) {
                console.error('Error fetching position in league: ', e);
            }
        };
        fetchUsersFromLeague();
    },[]);

    const fetchUsersFromLeague = async () => {
        if (currentLeague) {
            try {
                const response = await axios.get(`http://localhost:8080/api/leagues/${currentLeague.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { page, size: 10 },
                });
                setTotalPages(response.data.page.totalPages);
                setUserList(response.data.content);
                
            } catch (e) {
                console.error('Error fetching users from league:', e);
            }
        }
    };

    useEffect(() => {
        fetchUsersFromLeague();
    }, [currentLeague, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage); 
    };

    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row>
                <Col md={3}>
                    <Sidebar />
                </Col>
                <Col md={6}>
                    <div className="main-content">
                        <div className="leaderboard-title">
                            {currentLeague ? currentLeague.name : "Brak aktualnej ligi"}
                        </div>
                        <div className="leaderboard-list">
                            {userList.map((userItem, index) => (
                                <div className="single-leader" key={index} style={{border: userItem.id===user.id ? "2px solid #C3EEFF" : ""}}>
                                    <Row>
                                        <Col style={{minWidth: "60%"}}>{userItem.username}</Col>
                                        <Col>{userItem.points} pkt.</Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 ? 
                            <div className="pagination-controls">
                                <button className="pagination-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>Poprzednia</button>
                                <span>{page + 1} z {totalPages}</span>
                                <button className="pagination-btn" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>Następna</button>
                            </div>
                        : "" }
                    </div>
                </Col>
                <Col md={3}>
                    <MiniStats isRanking={true} position={position}/>
                </Col>
            </Row>
        </Container>
    );
};

export default LeaderboardPanel;
