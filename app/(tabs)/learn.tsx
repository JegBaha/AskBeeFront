import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Ana Ekran Bileşeni
export default function Learn() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      {currentGame === null ? (
        <View style={styles.homeContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.title}>
              <Ionicons name="star" size={32} color="#FFD700" /> Eğlenceli Oyun Dünyası! <Ionicons name="star" size={32} color="#FFD700" />
            </Text>
          </Animated.View>
          <Pressable style={[styles.button, styles.englishButton]} onPress={() => setCurrentGame('english')}>
            <Ionicons name="language" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Bil Bakalım</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.mathButton]} onPress={() => setCurrentGame('math')}>
            <Ionicons name="calculator" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Matematik Eğlencesi</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.musicButton]} onPress={() => setCurrentGame('music')}>
            <Ionicons name="musical-notes" size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Müzik Yolculuğu</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {currentGame === 'english' && <EnglishGame onBack={() => setCurrentGame(null)} />}
          {currentGame === 'math' && <MathGame onBack={() => setCurrentGame(null)} />}
          {currentGame === 'music' && <MusicGame onBack={() => setCurrentGame(null)} />}
        </>
      )}
    </View>
  );
}

// İngilizce Oyunu Bileşeni
function EnglishGame({ onBack }: { onBack: () => void }) {
  const colors = ['Kırmızı', 'Mavi', 'Yeşil', 'Sarı'];
  const colorCodes = ['#FF4D4D', '#4DA8FF', '#4CAF50', '#FFD700'];
  const [question, setQuestion] = useState(colors[Math.floor(Math.random() * colors.length)]);
  const [score, setScore] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = (selectedColor: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    if (selectedColor === question) {
      setScore(score + 1);
      setQuestion(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      alert('Oops! Yanlış renk, tekrar dene! 😊');
    }
  };

  return (
    <View style={styles.gameContainer}>
      <Text style={styles.question}>
        <Ionicons name="color-palette" size={28} color="#FF69B4" /> Hangi renk: {question}?
      </Text>
      <Animated.View style={[styles.buttons, { transform: [{ scale: scaleAnim }] }]}>
        {colorCodes.map((color, index) => (
          <Pressable
            key={index}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => handlePress(colors[index])}
          >
            <Ionicons name="heart" size={24} color="#FFF" />
          </Pressable>
        ))}
      </Animated.View>
      <Text style={styles.score}>
        <Ionicons name="trophy" size={24} color="#FFD700" /> Skor: {score}
      </Text>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Ana Menü</Text>
      </Pressable>
    </View>
  );
}

// Matematik Oyunu Bileşeni
function MathGame({ onBack }: { onBack: () => void }) {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [score, setScore] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const correctAnswer = num1 + num2;
  const options = [
    correctAnswer,
    correctAnswer + Math.floor(Math.random() * 5) + 1,
    correctAnswer - Math.floor(Math.random() * 5) - 1,
  ].sort(() => Math.random() - 0.5);

  const handlePress = (selected: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    if (selected === correctAnswer) {
      setScore(score + 1);
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
    } else {
      alert('Hata! Doğru cevabı bulmaya çalış! 😄');
    }
  };

  return (
    <View style={styles.gameContainer}>
      <Text style={styles.question}>
        <Ionicons name="add" size={28} color="#FF69B4" /> {num1} + {num2} = ?
      </Text>
      <Animated.View style={[styles.buttons, { transform: [{ scale: scaleAnim }] }]}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={() => handlePress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
            <Ionicons name="star" size={20} color="#FFD700" />
          </Pressable>
        ))}
      </Animated.View>
      <Text style={styles.score}>
        <Ionicons name="trophy" size={24} color="#FFD700" /> Skor: {score}
      </Text>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Ana Menü</Text>
      </Pressable>
    </View>
  );
}

// Müzik Oyunu Bileşeni
function MusicGame({ onBack }: { onBack: () => void }) {
  const notes = ['Do', 'Re', 'Mi', 'Fa', 'Sol'];
  const [currentNote, setCurrentNote] = useState(notes[Math.floor(Math.random() * notes.length)]);
  const [score, setScore] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const playSound = (note: string) => {
    console.log(`${note} sesi çalınıyor...`); // Gerçek uygulamada ses dosyası çalınır
  };

  const handlePress = (selectedNote: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    if (selectedNote === currentNote) {
      setScore(score + 1);
      const newNote = notes[Math.floor(Math.random() * notes.length)];
      setCurrentNote(newNote);
      playSound(newNote);
    } else {
      alert('Yanlış nota! Bir daha dene! 🎵');
    }
  };

  return (
    <View style={styles.gameContainer}>
      <Text style={styles.question}>
        <Ionicons name="musical-note" size={28} color="#FF69B4" /> Hangi nota?
      </Text>
      <Pressable style={styles.playButton} onPress={() => playSound(currentNote)}>
        <Ionicons name="play" size={20} color="#FFF" />
        <Text style={styles.playButtonText}>Nota Dinle</Text>
      </Pressable>
      <Animated.View style={[styles.buttons, { transform: [{ scale: scaleAnim }] }]}>
        {notes.map((note, index) => (
          <Pressable
            key={index}
            style={styles.noteButton}
            onPress={() => handlePress(note)}
          >
            <Text style={styles.noteText}>{note}</Text>
            <Ionicons name="musical-notes" size={20} color="#FFF" />
          </Pressable>
        ))}
      </Animated.View>
      <Text style={styles.score}>
        <Ionicons name="trophy" size={24} color="#FFD700" /> Skor: {score}
      </Text>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#FFF" />
        <Text style={styles.backButtonText}>Ana Menü</Text>
      </Pressable>
    </View>
  );
}

// Stil Tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    width: 250,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  englishButton: {
    backgroundColor: '#4CAF50',
  },
  mathButton: {
    backgroundColor: '#FF9800',
  },
  musicButton: {
    backgroundColor: '#9C27B0',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 15,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  playButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  playButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noteButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 15,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  noteText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  score: {
    fontSize: 22,
    color: '#388E3C',
    fontWeight: 'bold',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});