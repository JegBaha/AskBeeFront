import React, { useRef } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Image, Animated } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface TutorialItemData {
  id: string;
  title: string;
  description: string;
  imageSource: any;
}

const tutorialData: TutorialItemData[] = [
  {
    id: '1',
    title: 'Merhaba, Ben Bee!',
    description: 'Merak ettiğin her şeyi sana öğretmek için buradayım',
    imageSource: require('/assets/images/bee.png'),
  },
  {
    id: '2',
    title: 'Birlikte Çevrendeki Her Şeyi Keşfedebiliriz',
    description: 'Ayrıca sana masallar anlatabilirim ve senin için animasyonlar oluşturabilirim',
    imageSource: require('/assets/images/bee.png'),
  },
  {
    id: '3',
    title: 'Bana Göstermen Yeterli!',
    description: 'Kameranı istediğin nesneye tut ve senin için açıklayayım. Hazırsan Başlayalım!',
    imageSource: require('/assets/images/bee.png'),
  },
  {
    id: '4',
    title: 'Senin Hep Yanındayım',
    description: 'Benimle konuşmak için, görselime tıklayabilirsin',
    imageSource: require('/assets/images/bee.png'),
  },
  {
    id: '5',
    title: 'Dostların burada',
    description: 'Tavşan, kedi veya arı, istediğin dostunla görüntülü konuşabilirsin!',
    imageSource: require('/assets/images/bee.png'),
  },
  {
    id: '6',
    title: 'Yeni şeyler öğrenmek artık çok eğlenceli!',
    description: 'İstediğin etkinliğin üzerine dokun ve Bee ile eğlenceli bir keşfe çık! Hazırsan başlayalım!',
    imageSource: require('/assets/images/bee.png'),
  },
];

interface TutorialItemProps {
  item: TutorialItemData;
  index: number;
  currentIndex: number;
  onNext: () => void;
  onFinish: () => void;
}

const TutorialItem: React.FC<TutorialItemProps> = ({ item, index, currentIndex, onNext, onFinish }) => {
  const isLastItem = index === tutorialData.length - 1;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleFinishWithAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: -height,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View style={[styles.slideWrapper, { transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={['#4A90E2', '#80D8FF']} // index.tsx header gradient
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.slide}>
          <View style={styles.content}>
            <Image
              source={item.imageSource}
              style={index === 1 ? styles.imageLarge : styles.image}
              resizeMode="contain"
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {isLastItem ? (
              <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideAnim }] }]}>
                <Button
                  mode="contained"
                  onPress={handleFinishWithAnimation}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}>
                  Başlayalım!
                </Button>
              </Animated.View>
            ) : (
              <Button mode="contained" onPress={onNext} style={styles.button} labelStyle={styles.buttonLabel}>
                Devam Et
              </Button>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const TutorialScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const { beeName } = useLocalSearchParams(); // NewAccount2'den gelen beeName

  const handleNext = () => {
    if (currentIndex < tutorialData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handleFinish = () => {
    router.push({ pathname: '/index', params: { beeName } }); // http://localhost:8081/ -> /index
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {tutorialData.map((_, index: number) => (
          <View
            key={index}
            style={[styles.dot, { backgroundColor: index === currentIndex ? '#FFF' : 'rgba(255, 255, 255, 0.5)' }]}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#80D8FF']} // Tüm ekranı kaplayan gradient
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('/assets/images/bee.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>ASK BEE</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={tutorialData}
        renderItem={({ item, index }) => (
          <TutorialItem
            item={item}
            index={index}
            currentIndex={currentIndex}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {renderDots()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideWrapper: {
    width: width,
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 120,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFD700', // index.tsx beeImage kenarlığı
    backgroundColor: '#E0F7FA', // index.tsx beeImage arka planı
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  imageLarge: {
    width: 180,
    height: 180,
    marginBottom: 20,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#E0F7FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFF', // index.tsx header metin rengi
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    color: '#FFF', // index.tsx header metin rengi
    marginBottom: 20,
    fontSize: 18,
    maxWidth: 400,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // index.tsx header metin rengi
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700', // index.tsx beeImage kenarlığı
  },
  button: {
    marginTop: 20,
    backgroundColor: '#5C9CE6', // index.tsx modeButton rengi
    borderRadius: 20,
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default TutorialScreen;