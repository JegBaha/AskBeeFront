import ReactTouches from 'react';
import { StyleSheet, View, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen2: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#80D8FF']} // index.tsx header gradient
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Image
          source={require('/assets/images/bee.png')} // Relatif yol
          style={styles.icon}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <ActivityIndicator size="large" color="#FFF" style={styles.indicator} />
        <Text style={styles.text}>ASK BEE</Text>
      </LinearGradient>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8', // index.tsx container rengi
  },
  background: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60, // index.tsx beeImage yuvarlak tasarımı
    borderWidth: 3,
    borderColor: '#FFD700', // index.tsx beeImage kenarlığı
    backgroundColor: '#E0F7FA', // index.tsx beeImage arka planı
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  indicator: {
    marginBottom: 20,
  },
  text: {
    color: '#FFF', // index.tsx header metin rengi
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoadingScreen2;