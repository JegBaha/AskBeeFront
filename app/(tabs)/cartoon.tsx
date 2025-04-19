import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const questions = [
  { question: "Masalın kahramanları kimler?", illustration: require('/assets/bee.png') },
  { question: "Masal nerede geçiyor?", illustration: require('/assets/bee.png') },
  { question: "Masalda neler oluyor?", illustration: require('/assets/bee.png') },
];

// Örnek hikayeler (10 adet)
const stories = [
  { id: 1, title: "Sihirli Orman", date: "14.04.2025" },
  { id: 2, title: "Yıldızlı Gökyüzü", date: "14.04.2025" },
  { id: 3, title: "Cesur Tavşan", date: "14.04.2025" },
  { id: 4, title: "Gökkuşağı Macerası", date: "14.04.2025" },
  { id: 5, title: "Deniz Altı Hikayesi", date: "14.04.2025" },
  { id: 6, title: "Uçan Balon", date: "14.04.2025" },
  { id: 7, title: "Kayıp Hazine", date: "14.04.2025" },
  { id: 8, title: "Dans Eden Yıldızlar", date: "14.04.2025" },
  { id: 9, title: "Minik Ejderha", date: "14.04.2025" },
  { id: 10, title: "Büyülü Bahçe", date: "14.04.2025" },
].slice(0, 10);

export default function CartoonScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Sunucu bağlantı testi
    const checkServer = async () => {
      try {
        console.log('Sunucu bağlantısı kontrol ediliyor...');
        const response = await fetch('http://192.168.64.162:5000/test');
        const data = await response.json();
        console.log('Sunucu testi cevabı:', data);
      } catch (error) {
        console.error('Sunucu bağlantı hatası:', error);
        Alert.alert('Hata', 'Sunucuya bağlanılamadı. Bağlantınızı kontrol edin.');
      }
    };
    checkServer();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Mikrofon izni gerekiyor! 🎤');
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      console.log('Kayıt başlatılıyor...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Kayıt başladı');
    } catch (error) {
      console.error('Kayıt başlatma hatası:', error);
      Alert.alert('Hata', 'Kayıt başlatılamadı. 😔');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Kayıt durduruluyor...');
      if (!recording) {
        console.error('Aktif kayıt yok');
        Alert.alert('Hata', 'Kayıt bulunamadı.');
        return;
      }
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Kaydedilen dosya URI:', uri);

      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          console.error('Ses dosyası bulunamadı:', uri);
          Alert.alert('Hata', 'Kayıt dosyası bulunamadı.');
          return;
        }
        console.log('Dosya bilgileri:', fileInfo);
      } else {
        console.log('Web platformunda dosya kontrolü atlanıyor');
      }

      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      });
      console.log('FormData hazırlandı');

      console.log('Sese backend\'e gönderiliyor...');
      const response = await fetch('http://192.168.64.162:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Sunucu cevabı:', data);

      if (data.text) {
        setAnswers(prev => [...prev, data.text]);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          console.log('Sonraki soru:', currentQuestion + 1);
        } else {
          Alert.alert(
            'Harika!',
            'Masalın hazırlanıyor! Hazır olduğunda sana haber vereceğiz! 🌟',
            [
              {
                text: 'Süper!',
                onPress: () => {
                  console.log('Ana sayfaya yönlendiriliyor');
                  router.push('/(tabs)/index');
                },
              },
            ]
          );
        }
      } else {
        console.error('Transkripsiyon hatası:', data.error);
        Alert.alert(
          'Hata',
          data.error || 'Ses tanınamadı, tekrar dene! 😊',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Tekrar Dene', onPress: startRecording },
          ]
        );
      }
    } catch (error) {
      console.error('Kayıt durdurma hatası:', error);
      Alert.alert(
        'Bağlantı Hatası',
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

  const renderStoryItem = ({ item }: { item: { id: number; title: string; date: string } }) => (
    <View style={styles.storyItem}>
      <View style={styles.storyTextContainer}>
        <Text style={styles.storyTitle}>
          <Ionicons name="book" size={16} color="#FF69B4" /> {item.title}
        </Text>
        <Text style={styles.storyDate}>{item.date} Macerası</Text>
      </View>
      <Pressable style={styles.playButton}>
        <Ionicons name="play" size={18} color="#FFF" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Ionicons name="sparkles" size={28} color="#FFD700" /> Kendi Masalını Yarat! <Ionicons name="sparkles" size={28} color="#FFD700" />
        </Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          <Ionicons name="" size={24} color="#FF69B4" /> {questions[currentQuestion].question}
        </Text>
        {answers[currentQuestion] && (
          <Text style={styles.transcribedText}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" /> Cevabın: {answers[currentQuestion]}
          </Text>
        )}
        <Image source={questions[currentQuestion].illustration} style={styles.illustration} />
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.micButton, isRecording && styles.micButtonRecording]}
        >
          {isRecording ? (
            <Ionicons name="stop-circle" size={32} color="#FFF" />
          ) : (
            <Ionicons name="mic" size={32} color="#FFF" />
          )}
        </Pressable>
      </View>
      <View style={styles.storiesContainer}>
        <Text style={styles.storiesHeader}>
          <Ionicons name="library" size={20} color="#0288D1" /> Masal Koleksiyonum
        </Text>
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
    backgroundColor: '#E0F7FA',
    paddingBottom: 76,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#4FC3F7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 15,
    textAlign: 'center',
  },
  transcribedText: {
    fontSize: 16,
    color: '#388E3C',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  micButton: {
    backgroundColor: '#FF5722',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  micButtonRecording: {
    backgroundColor: '#D81B60',
  },
  storiesContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  storiesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1',
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
    backgroundColor: '#E1F5FE',
    borderRadius: 15,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  storyTextContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
  },
  storyDate: {
    fontSize: 12,
    color: '#4A5568',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});