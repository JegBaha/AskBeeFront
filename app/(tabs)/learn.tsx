import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Yerel ses dosyasını ekleyin
const METAL_TRACK = require('/assets/metal-track.mp3'); // Ses dosyanızın yolunu buraya yazın

// Sayı dizisi: 500 rastgele sayı, %20 bozuk, rastgele renk
const sequence = Array.from({ length: 500 }, () => ({
  number: Math.floor(Math.random() * 4) + 1,
  corrupted: Math.random() < 0.2,
  color: Math.random() < 0.5 ? 'blue' : 'red', // %50 mavi, %50 kırmızı
}));

export default function RhythmGameScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 dakika
  const [hasHitCurrent, setHasHitCurrent] = useState(false);
  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const sequenceTimerRef = useRef(null);
  const animatedValues = useRef(Array(5).fill().map(() => new Animated.Value(1))).current;
  const speedRef = useRef(1000); // Başlangıç bekleme süresi (ms)

  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      clearInterval(timerRef.current);
      clearTimeout(sequenceTimerRef.current);
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(METAL_TRACK, { shouldPlay: false });
      soundRef.current = sound;
      await sound.setVolumeAsync(0.1);
      console.log('Ses dosyası yüklendi ve ses seviyesi %10.');
    } catch (error) {
      console.error('Ses yükleme hatası:', error);
    }
  };

  const startGame = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      setCurrentIndex(0);
      setScore(0);
      setFeedback('');
      setTimeLeft(120);
      setHasHitCurrent(false);
      speedRef.current = 1000;

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      advanceSequence();
    }
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(sequenceTimerRef.current);
    setFeedback(`Oyun bitti! Skor: ${score}`);
    setIsPlaying(false);
    if (soundRef.current) {
      soundRef.current.stopAsync();
    }
  };

  const pauseGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(sequenceTimerRef.current);
    setFeedback('Oyun durduruldu.');
    setIsPlaying(false);
    if (soundRef.current) {
      soundRef.current.stopAsync();
    }
  };

  const advanceSequence = () => {
    if (!isPlaying) return;

    setHasHitCurrent(false);
    let delay = speedRef.current;

    if (currentIndex % 10 === 0) {
      speedRef.current = Math.max(300, speedRef.current - 50);
    }

    if (Math.random() < 0.05) {
      delay += 1000;
    }

    sequenceTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= sequence.length || !isPlaying) {
          endGame();
          return prev;
        }
        animatedValues.forEach((anim) => anim.setValue(1));
        return prev + 1;
      });
      if (isPlaying) {
        advanceSequence();
      }
    }, delay);
  };

  const handleButtonPress = (buttonNumber) => {
    if (!isPlaying) return;

    const currentItem = sequence[currentIndex];
    if (!hasHitCurrent && currentItem.color === 'blue' && buttonNumber === currentItem.number) {
      setScore(score + 1);
      setFeedback('Mükemmel!');
      setHasHitCurrent(true);
      Animated.sequence([
        Animated.timing(animatedValues[0], {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[0], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setFeedback('Kaçırdın!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ritim Oyunu 🎸</Text>
        <Text style={styles.headerSubtitle}>Mavi sayıya bas! Kalan süre: {timeLeft} sn</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPlaying ? (
          <Pressable style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Başla!</Text>
          </Pressable>
        ) : (
          <>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Skor: {score}</Text>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
            <View style={styles.sequenceContainer}>
              {sequence.slice(currentIndex, currentIndex + 5).map((item, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.sequenceItem,
                    index === 0 && styles.currentSequenceItem,
                    {
                      transform: [{ scale: animatedValues[index] }],
                    },
                  ]}>
                  <Text
                    style={[
                      styles.sequenceText,
                      index === 0 && styles.currentSequenceText,
                      item.color === 'blue' && styles.blueSequenceText,
                      item.color === 'red' && styles.redSequenceText,
                      item.corrupted && styles.corruptedSequenceText,
                    ]}>
                    {item.number}
                  </Text>
                </Animated.View>
              ))}
            </View>
            <View style={styles.buttonsContainer}>
              {[1, 2, 3, 4].map((num) => (
                <Pressable
                  key={num}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handleButtonPress(num)}>
                  <Text style={styles.buttonText}>{num}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.pauseButton} onPress={pauseGame}>
              <Text style={styles.pauseButtonText}>Durdur</Text>
            </Pressable>
          </>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  feedbackText: {
    fontSize: 18,
    color: '#4A90E2',
    marginTop: 8,
  },
  sequenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sequenceItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  currentSequenceItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1E8FF',
  },
  sequenceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentSequenceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  blueSequenceText: {
    color: '#4A90E2',
  },
  redSequenceText: {
    color: '#FF6B6B',
  },
  corruptedSequenceText: {
    textDecorationLine: 'line-through',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#357ABD',
    transform: [{ scale: 0.9 }],
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});