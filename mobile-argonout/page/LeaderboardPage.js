import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import { useUser } from "../context/UserContext";
import BottomMenu from "../component/BottomMenu";
import MiniStats from "../component/MiniStats";
import { BASE_URL } from "../config";

const LeaderboardPage = () => {
    const { user } = useUser(); 
    const [leaguesData, setLeaguesData] = useState([]);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [userList, setUserList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [position, setPosition] = useState("...");

    const fetchLeagues = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem("accessTokenFront");
            const response = await axios.get(`${BASE_URL}/api/leagues/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaguesData(response.data);
        } catch (e) {
            Alert.alert("Błąd", "Nie udało się pobrać danych lig.");
            console.error('Error fetching leagues:', e);
        }finally{
            setIsLoading(false);
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
            }
        }
    }, [leaguesData, user, currentLeague]);

    const fetchPosition = async () => {
        try {
            const token = await AsyncStorage.getItem("accessTokenFront");
            const response = await axios.get(`${BASE_URL}/api/leagues/current-player/position`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosition(response.data);
        } catch (e) {
            console.error('Error fetching position in league:', e);
        }
    };

    useEffect(() => {
        fetchPosition();
    }, []);

    const fetchUsersFromLeague = async () => {
        if (currentLeague) {
            try {
                const token = await AsyncStorage.getItem("accessTokenFront");
                const response = await axios.get(`${BASE_URL}/api/leagues/${currentLeague.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { page, size: 10 },
                });
                setTotalPages(response.data.page.totalPages);
                setUserList(response.data.content);
            } catch (e) {
                Alert.alert("Błąd", "Nie udało się pobrać danych użytkowników.");
                console.error('Error fetching users from league:', e);
            }
        }
    };

    useEffect(() => {
        fetchUsersFromLeague();
    }, [currentLeague, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={[styles.singleLeader, item.id === user?.id && styles.highlightedUser]}>
            <Text style={styles.leaderText}>{item.username}</Text>
            <Text style={styles.leaderPoints}>{item.points} pkt.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <Text style={styles.leaderboardTitle}>
                    {isLoading ? 
                    (<Spinner visible={isLoading} textContent={"Ładowanie aktualnej ligi..."} textStyle={styles.spinnerTextStyle} />) : 
                    currentLeague?.name }
                </Text>
                <FlatList
                    data={userList}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={
                        totalPages > 1 && (
                            <View style={styles.paginationControls}>
                                <TouchableOpacity
                                    style={[styles.paginationBtn, page === 0 && styles.disabledBtn]}
                                    onPress={() => handlePageChange(page - 1)}
                                    disabled={page === 0}
                                >
                                    <Text style={styles.paginationText}>Poprzednia</Text>
                                </TouchableOpacity>
                                <Text style={styles.paginationText}>{page + 1} z {totalPages}</Text>
                                <TouchableOpacity
                                    style={[styles.paginationBtn, page === totalPages - 1 && styles.disabledBtn]}
                                    onPress={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1}
                                >
                                    <Text style={styles.paginationText}>Następna</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                />
                <MiniStats isRanking={true} position={position} />
            </View>
            <BottomMenu />
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#131F24",
    },
    mainContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    leaderboardTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#2F7A7E",
        marginTop: 53,
        paddingBottom: 8,
        marginBottom: 24,
    },
    leaderboardList: {
        marginBottom: 20,
    },
    singleLeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#1E2E36",
        borderRadius: 12,
        marginBottom: 12,
        borderColor: "#2F7A7E",
        borderWidth: 1,
    },
    highlightedUser: {
        borderColor: "#C3EEFF",
    },
    leaderText: {
        color: "#fff",
        fontSize: 16,
    },
    leaderPoints: {
        color: "#C3EEFF",
        fontSize: 16,
    },
    paginationControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paginationBtn: {
        backgroundColor: "#2F7A7E",
        padding: 10,
        borderRadius: 8,
    },
    disabledBtn: {
        backgroundColor: "#555",
    },
    paginationText: {
        color: "#fff",
    },
});

export default LeaderboardPage;
