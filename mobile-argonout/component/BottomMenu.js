import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BottomMenu = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: require('../assets/icons/home_4917086.png'), route: 'Home', alt: 'Graj' },
    { icon: require('../assets/icons/rocket_1012233.png'), route: 'Adventure', alt: 'Tryb wyzwania' },
    { icon: require('../assets/icons/trophy_11114779.png'), route: 'Leaderboard', alt: 'Ranking' },
    { icon: require('../assets/icons/scroll_9288695.png'), route: 'History', alt: 'Historia' },
    { icon: require('../assets/icons/note_2356169.png'), route: 'Messages', alt: 'Wiadomości' },
    { icon: require('../assets/icons/folder_5679940.png'), route: 'Settings', alt: 'Ustawienia' },
  ];

  return (
    <>
      {/* Bottom Menu */}
      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Image source={item.icon} style={styles.icon} />
          </TouchableOpacity>
        ))}

        {/* Hamburger Icon */}
        <TouchableOpacity style={styles.hamburgerButton} onPress={toggleSidebar}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <View style={styles.sidebar}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
          

          {/* Sidebar Menu */}
          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  navigation.navigate(item.route);
                }}
              >
                <Image source={item.icon} style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>{item.alt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
                key={menuItems.length}
                style={styles.sidebarMenuItem}
                onPress={() => {
                  toggleSidebar();
                  navigation.navigate('Login');
                }}
              >
                <Image source={require('../assets/icons/exit_11820530.png')} style={[styles.sidebarIcon, {borderBottomWidth: 0}]} />
                <Text style={styles.sidebarText}>{"Wyloguj"}</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#131F24',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#2F7A7E',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  menuItem: {
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  hamburgerButton: {
    marginTop: 7
  },
  hamburgerText: {
    color: '#D1D1D1',
    fontSize: 38,
  },

  sidebar: {
    flex: 1,
    backgroundColor: '#131F24',
    paddingTop: 20,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  logoContainer: {
    alignItems: 'center'
  },
  logo: {
    width: "100%",
    height: 80,
    resizeMode: 'contain',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: '#D1D1D1',
    fontSize: 24,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '100%'
  },
  sidebarIcon: {
    width: 40,
    height: 40,
    marginRight: 15
  },
  sidebarText: {
    color: '#D1D1D1',
    fontSize: 18,
  },
});

export default BottomMenu;
