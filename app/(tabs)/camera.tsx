import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<'front' | 'back'>('back');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          console.log('Kamera izni verilmedi:', status);
        }
      } catch (error) {
        console.error('Kamera izni alınırken hata:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleCapture = () => {
    router.push('/chat?fromCamera=true');
  };

  if (Platform.OS === 'web'|| Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kamera webde desteklenmiyor.</Text>
      </View>
    );
    
  }
  

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Kamera izni yükleniyor...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kameraya erişim izni yok. Lütfen cihaz ayarlarından izni verin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.overlay}>
          <Pressable
            style={styles.flipButton}
            onPress={() => {
              setType(type === 'back' ? 'front' : 'back');
            }}
          >
            <Ionicons name="camera-reverse" size={28} color="white" />
          </Pressable>
          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              Bir nesneyi göster ve düğmeye bas! 📸
            </Text>
          </View>
          <Pressable style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureInner} />
          </Pressable>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
    marginTop: 50,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 20,
  },
  guideText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  captureButton: {
    alignSelf: 'center',
    marginBottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});