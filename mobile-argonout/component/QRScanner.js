import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

const QRScanner = ({ onQRCodeScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setScannedData(data);
    console.log("QR Code scanned!");
    console.log("Data: ", data);
  };

  const handleConfirmScan = () => {
    if (scannedData) {
      onQRCodeScanned(scannedData);
    } else {
      Alert.alert("No QR Code scanned!", "Please scan a QR Code first.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Zeskanuj kod QR</Text>
        </View>
      </CameraView>

      <View style={styles.buttonContainer}>
        <Button
          title={scannedData ? "Wyślij" : "Brak kodu QR"}
          onPress={handleConfirmScan}
          disabled={!scannedData}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: 60,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    paddingHorizontal: 20,
    zIndex: 99999,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#56bfc1',
    backgroundColor: '#333',
  },
  button: {
    backgroundColor: '#56bfc1',
    paddingVertical: 15,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QRScanner;
