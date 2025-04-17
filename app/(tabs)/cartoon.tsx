import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const questions = [
  { question: "Baş Karakterler Kim?", illustration: require('/assets/bee.png') },
  { question: "Nerede Geçiyor", illustration: require('/assets/bee.png') },
  { question: "Masal'da Neler Yaşanıyor?", illustration: require('/assets/bee.png') },
];

// Sample stories data (limited to 10)
const stories = [
  { id: 1, title: "Masal 1", date: "14.04.2025" },
  { id: 2, title: "Masal 2", date: "14.04.2025" },
  { id: 3, title: "Masal 3", date: "14.04.2025" },
  { id: 4, title: "Masal 4", date: "14.04.2025" },
  { id: 5, title: "Masal 5", date: "14.04.2025" },
  { id: 6, title: "Masal 6", date: "14.04.2025" },
  { id: 7, title: "Masal 7", date: "14.04.2025" },
  { id: 8, title: "Masal 8", date: "14.04.2025" },
  { id: 9, title: "Masal 9", date: "14.04.2025" },
  { id: 10, title: "Masal 10", date: "14.04.2025" },
].slice(0, 10); // Limit to 10 stories

export default function CartoonScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Test server connectivity on mount
    const checkServer = async () => {
      try {
        console.log('Checking server connectivity...');
        const response = await fetch('http://192.168.64.162:5000/test');
        const data = await response.json();
        console.log('Server test response:', data);
      } catch (error) {
        console.error('Server connectivity error:', error);
        Alert.alert('Hata', 'Sunucuya bağlanılamadı. Lütfen bağlantıyı kontrol edin.');
      }
    };
    checkServer();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Mikrofon izni gerekli!');
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      console.log('Starting recording...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Kayıt başlatma hatası:', error);
      Alert.alert('Hata', 'Kayıt başlatılamadı.');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      if (!recording) {
        console.error('No active recording');
        Alert.alert('Hata', 'Aktif kayıt yok.');
        return;
      }
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recorded file URI:', uri);

      // Skip FileSystem check on web
      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          console.error('Audio file does not exist at URI:', uri);
          Alert.alert('Hata', 'Kayıt dosyası bulunamadı.');
          return;
        }
        console.log('File info:', fileInfo);
      } else {
        console.log('Skipping file check on web');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      });
      console.log('FormData prepared for upload');

      // Send to backend
      console.log('Sending audio to backend...');
      const response = await fetch('http://192.168.64.162:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Server response:', data);

      if (data.text) {
        setAnswers(prev => [...prev, data.text]);
        if (currentQuestion < questions.length - 1) {
          // Move to the next question
          setCurrentQuestion(prev => prev + 1);
          console.log('Advancing to question:', currentQuestion + 1);
        } else {
          // Last question: navigate to index
          Alert.alert(
            'Tamamlandı',
            'Masalın hazırlanıyor, hazırlandığında seni bilgilendireceğim.',
            [
              {
                text: 'Tamam',
                onPress: () => {
                  console.log('Navigating to index');
                  router.push('/(tabs)/index');
                },
              },
            ]
          );
        }
      } else {
        console.error('Transcription error:', data.error);
        Alert.alert(
          'Hata',
          data.error || 'Ses tanınamadı, lütfen tekrar deneyin.',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Tekrar Dene', onPress: startRecording },
          ]
        );
      }
    } catch (error) {
      console.error('Kayıt durdurma hatası:', error);
      Alert.alert(
        'Bağlantı hatası',
        'Sunucuya bağlanılamadı: ' + error.message,
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Tekrar Dene', onPress: startRecording },
        ]
      );
    } finally {
      setRecording(null);
      setIsRecording(false);
    }
  };

  const renderStoryItem = ({ item }) => (
    <View style={styles.storyItem}>
      <View style={styles.storyTextContainer}>
        <Text style={styles.storyTitle}>MASAL {item.date}</Text>
        <Text style={styles.storyDate}>{item.date} DIYARI</Text>
      </View>
      <Pressable style={styles.playButton}>
        <Ionicons name="play" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Masal Oluşturalım!</Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
        {answers[currentQuestion] && (
          <Text style={styles.transcribedText}>
            Transcribed: {answers[currentQuestion]}
          </Text>
        )}
        <Image source={questions[currentQuestion].illustration} style={styles.illustration} />
        <Pressable onPress={isRecording ? stopRecording : startRecording} style={styles.micButton}>
          {isRecording ? (
            <Ionicons name="stop" size={24} color="#FFFFFF" />
          ) : (
            <Ionicons name="mic" size={24} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
      <View style={styles.storiesContainer}>
        <Text style={styles.storiesHeader}>ÇİZGİ FİLMLERİM</Text>
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={item => item.id.toString()}
          style={styles.storiesList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    paddingBottom: 76, // Add padding to account for the tab bar height (60 + 8 + 8)
  },
  header: {
    padding: 20,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
    textAlign: 'center',
  },
  transcribedText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  illustration: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  micButton: {
    backgroundColor: '#4A90E2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 200, // Fixed height for the stories section
  },
  storiesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
    textAlign: 'center',
  },
  storiesList: {
    flexGrow: 0,
  },
  storyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  storyTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  storyDate: {
    fontSize: 14,
    color: '#4A5568',
  },
  playButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 10,
  },
});