import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const TOTAL_QUESTIONS = 4;

// Örnek çizgi filmler (sonradan dinamik hale getirilebilir)
const cartoons = [
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

export default function CartoonFilmScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'welcome' | 'question' | 'generating' | 'story'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [storyData, setStoryData] = useState<{
    story: string;
    images: string[];
    summary_audio: string;
    summary_text: string;
  } | null>(null);

  // Hoş geldin mesajını alma
  const fetchWelcomeMessage = async () => {
    try {
      const response = await fetch('http://192.168.64.162:5000/api/welcome-message', { signal: AbortSignal.timeout(5000) });
      const data = await response.json();
      if (data.audio_url && data.text) {
        const { sound } = await Audio.Sound.createAsync({ uri: data.audio_url });
        await sound.playAsync();
        Alert.alert('Hoş Geldin!', data.text, [
          {
            text: 'Evet, başlayalım!',
            onPress: () => {
              setPhase('question');
              setCurrentQuestionIndex(0);
            },
          },
          { text: 'Hayır', style: 'cancel' },
        ]);
      } else {
        throw new Error('Geçersiz yanıt');
      }
    } catch (error: any) {
      console.error('Karşılama mesajı hatası:', error);
      let errorMessage = 'Sunucuya bağlanılamadı.';
      if (error.name === 'TimeoutError') errorMessage = 'Bağlantı zaman aşımına uğradı.';
      Alert.alert('Hata', errorMessage);
    }
  };

  // Soruyu alma
  const fetchQuestion = async (questionId: number) => {
    try {
      const response = await fetch(`http://192.168.64.162:5000/api/ask-question/${questionId}`, { signal: AbortSignal.timeout(5000) });
      const data = await response.json();
      if (data.audio_url && data.text) {
        const { sound } = await Audio.Sound.createAsync({ uri: data.audio_url });
        await sound.playAsync();
        setCurrentQuestionText(data.text);
      } else {
        throw new Error('Geçersiz yanıt');
      }
    } catch (error: any) {
      console.error('Soru alma hatası:', error);
      Alert.alert('Hata', 'Soru alınamadı.');
    }
  };

  // Çizgi filmi oluşturma
  const generateCartoon = async (answers: string[]) => {
    try {
      setPhase('generating');
      const [heroes, place, superpower, child] = answers;
      const response = await fetch('http://192.168.64.162:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heroes, place, superpower, child }),
        signal: AbortSignal.timeout(30000), // 30 saniye timeout
      });
      const data = await response.json();
      if (data.story && data.images && data.summary_audio) {
        setStoryData(data);
        setPhase('story');
        const { sound } = await Audio.Sound.createAsync({ uri: data.summary_audio });
        await sound.playAsync();
      } else {
        throw new Error('Geçersiz yanıt');
      }
    } catch (error: any) {
      console.error('Çizgi film oluşturma hatası:', error);
      let errorMessage = 'Çizgi film oluşturulamadı.';
      if (error.name === 'TimeoutError') errorMessage = 'Bağlantı zaman aşımına uğradı.';
      Alert.alert('Hata', errorMessage);
      setPhase('question');
    }
  };

  // İlk yükleme ve temizleme
  useEffect(() => {
    fetchWelcomeMessage();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(err => console.error('Kayıt temizleme hatası:', err));
      }
    };
  }, [recording]);

  // Soru değişikliklerini izleme
  useEffect(() => {
    if (phase === 'question') {
      fetchQuestion(currentQuestionIndex);
    }
  }, [phase, currentQuestionIndex]);

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

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Kayıt başlatma hatası:', error);
      Alert.alert('Hata', 'Kayıt başlatılamadı. 😔');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        Alert.alert('Hata', 'Kayıt bulunamadı.');
        return;
      }
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('Kayıt URI alınamadı');

      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      });

      const response = await fetch(`http://192.168.64.162:5000/api/record-answer/${currentQuestionIndex}`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (data.transcribed_text) {
        setAnswers(prev => {
          const newAnswers = [...prev, data.transcribed_text];
          if (newAnswers.length === TOTAL_QUESTIONS) {
            generateCartoon(newAnswers);
          } else {
            setCurrentQuestionIndex(newAnswers.length);
          }
          return newAnswers;
        });
      } else {
        throw new Error(data.error || 'Ses tanınamadı');
      }
    } catch (error: any) {
      console.error('Kayıt durdurma hatası:', error);
      let errorMessage = 'Ses kaydedilemedi.';
      if (error.name === 'TimeoutError') errorMessage = 'Bağlantı zaman aşımına uğradı.';
      Alert.alert('Hata', errorMessage, [
        { text: 'İptal', style: 'cancel' },
        { text: 'Tekrar Dene', onPress: startRecording },
      ]);
    } finally {
      setRecording(null);
      setIsRecording(false);
    }
  };

  const renderCartoonItem = ({ item }: { item: { id: number; title: string; date: string } }) => (
    <View style={styles.cartoonItem}>
      <View style={styles.cartoonTextContainer}>
        <Text style={styles.cartoonTitle}>
          <Ionicons name="film" size={16} color="#FF69B4" /> {item.title}
        </Text>
        <Text style={styles.cartoonDate}>{item.date} Macerası</Text>
      </View>
      <Pressable style={styles.playButton}>
        <Ionicons name="play" size={18} color="#FFF" />
      </Pressable>
    </View>
  );

  if (phase === 'generating') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            <Ionicons name="sparkles" size={28} color="#FFD700" /> Kendi Çizgi Filmini Yarat! <Ionicons name="sparkles" size={28} color="#FFD700" />
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.loadingText}>Çizgi filmin hazırlanıyor... 🌟</Text>
        </View>
        <View style={styles.cartoonsContainer}>
          <Text style={styles.cartoonsHeader}>
            <Ionicons name="film" size={20} color="#0288D1" /> Çizgi Film Koleksiyonum
          </Text>
          <FlatList
            data={cartoons}
            renderItem={renderCartoonItem}
            keyExtractor={item => item.id.toString()}
            style={styles.cartoonsList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
          />
        </View>
      </View>
    );
  }

  if (phase === 'story' && storyData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            <Ionicons name="sparkles" size={28} color="#FFD700" /> Kendi Çizgi Filmini Yarat! <Ionicons name="sparkles" size={28} color="#FFD700" />
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.storyTitle}>Çizgi Filmin Hazır!</Text>
          <Text style={styles.storyText}>{storyData.story}</Text>
          {storyData.images.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.storyImage} />
          ))}
          <Pressable onPress={() => router.push('/(tabs)/index')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
          </Pressable>
        </View>
        <View style={styles.cartoonsContainer}>
          <Text style={styles.cartoonsHeader}>
            <Ionicons name="film" size={20} color="#0288D1" /> Çizgi Film Koleksiyonum
          </Text>
          <FlatList
            data={cartoons}
            renderItem={renderCartoonItem}
            keyExtractor={item => item.id.toString()}
            style={styles.cartoonsList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Ionicons name="sparkles" size={28} color="#FFD700" /> Kendi Çizgi Filmini Yarat! <Ionicons name="sparkles" size={28} color="#FFD700" />
        </Text>
      </View>
      {phase === 'question' && (
        <View style={styles.contentContainer}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestionText}</Text>
            {answers[currentQuestionIndex] && (
              <Text style={styles.transcribedText}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" /> Cevabın: {answers[currentQuestionIndex]}
              </Text>
            )}
            <Image source={require('/assets/bee.png')} style={styles.illustration} />
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
        </View>
      )}
      <View style={styles.cartoonsContainer}>
        <Text style={styles.cartoonsHeader}>
          <Ionicons name="film" size={20} color="#0288D1" /> Çizgi Film Koleksiyonum
        </Text>
        <FlatList
          data={cartoons}
          renderItem={renderCartoonItem}
          keyExtractor={item => item.id.toString()}
          style={styles.cartoonsList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
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
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
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
  cartoonsContainer: {
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
  cartoonsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 10,
    textAlign: 'center',
  },
  cartoonsList: {
    flexGrow: 0,
  },
  cartoonItem: {
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
  cartoonTextContainer: {
    flex: 1,
  },
  cartoonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0277BD',
  },
  cartoonDate: {
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
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0288D1',
    textAlign: 'center',
    marginTop: 50,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 20,
    textAlign: 'justify',
  },
  storyImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});