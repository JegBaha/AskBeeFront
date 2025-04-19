import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SERVER_URL = 'http://192.168.1.101:5000';

export default function ChatScreen() {
  const { fromCamera, animalName, animalImage } = useLocalSearchParams<{
    fromCamera: string;
    animalName: string;
    animalImage: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    if (!animalName) {
      router.replace('/characterSelection');
    }
  }, [animalName, router]);

  if (!animalName) {
    return null;
  }

  const chatbotCharacter = {
    name: animalName || 'Arı',
    image: animalImage ? JSON.parse(animalImage) : require('/assets/bee.png'),
  };

  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; image?: string }>>([
    { text: `Merhaba! Ben senin arkadaşın ${chatbotCharacter.name}. Birlikte öğrenmeye ne dersin?`, isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Yeni durum: Backend işleniyor
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        const audioStatus = await Audio.requestPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        setHasAudioPermission(audioStatus.status === 'granted');
        console.log('Permissions:', { camera: cameraStatus.status, audio: audioStatus.status });
      } catch (error) {
        console.error('Permission error:', error);
        setHasCameraPermission(false);
        setHasAudioPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (fromCamera === 'true') {
      const photoMessage = { text: 'Fotoğraf çekildi! Ne gördüğümü söyleyeyim...', isUser: false };
      setMessages(prev => [...prev, photoMessage]);

      setTimeout(() => {
        const aiResponse = {
          text: 'Bu fotoğrafta çok ilginç şeyler görüyorum! Birlikte keşfedelim!',
          isUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  }, [fromCamera]);

  useEffect(() => {
    if (!isCameraActive) {
      setIsCameraReady(false);
      setCameraKey(prev => prev + 1);
    }
  }, [isCameraActive]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = { text: data.response, isUser: false };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }
    } catch (error) {
      console.error('Text API error:', error);
      Alert.alert('Hata', 'Sunucuya ulaşılamadı: ' + SERVER_URL);
      const errorResponse = { text: 'Üzgünüm, bir hata oluştu.', isUser: false };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const startRecording = async () => {
    if (!hasAudioPermission) {
      Alert.alert('Hata', 'Mikrofon izni gerekli!');
      return;
    }

    try {
      console.log('Starting recording...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Recording start error:', error);
      Alert.alert('Hata', 'Kayıt başlatılamadı.');
    }
  };

  const stopRecording = async () => {
    setIsProcessing(true); // Yükleniyor durumu başlat
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

      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          console.error('Audio file does not exist at URI:', uri);
          Alert.alert('Hata', 'Kayıt dosyası bulunamadı.');
          return;
        }
        console.log('File info:', fileInfo);
      }

      const formData = new FormData();
      formData.append('audio', {
        uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      });
      console.log('FormData prepared for upload');

      const response = await fetch(`${SERVER_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Server response:', data);

      if (data.text) {
        const userMessage = { text: data.text, isUser: true };
        const aiResponse = { text: data.response, isUser: false };
        setMessages(prev => [...prev, userMessage, aiResponse]);
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
      console.error('Recording stop error:', error);
      Alert.alert(
        'Bağlantı hatası',
        'Sunucuya ulaşılamadı: ' + SERVER_URL,
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Tekrar Dene', onPress: startRecording },
        ]
      );
    } finally {
      setRecording(null);
      setIsRecording(false);
      setIsProcessing(false); // Yükleniyor durumu bitir
    }
  };

  const handleMicrophoneToggle = () => {
    if (isProcessing) return; // Yükleniyorsa tıklamayı engelle
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCameraAction = async () => {
    console.log('Camera action triggered:', {
      isCameraActive,
      isCameraReady,
      cameraRef: cameraRef.current,
      hasCameraPermission,
      cameraKey
    });

    if (!hasCameraPermission) {
      Alert.alert('Hata', 'Kamera izni gerekli! Lütfen cihaz ayarlarından izni verin.');
      return;
    }

    if (!isCameraActive) {
      setIsCameraActive(true);
      console.log('Camera activated, waiting for readiness...');
      return;
    }

    if (!isCameraReady || !cameraRef.current) {
      Alert.alert(
        'Hata',
        'Kamera hazırlanıyor, lütfen birkaç saniye bekleyin.',
        [
          { text: 'Tamam', style: 'cancel' },
          {
            text: 'Tekrar Dene',
            onPress: () => {
              setIsCameraActive(false);
              setTimeout(() => setIsCameraActive(true), 100);
            },
          },
        ]
      );
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      console.log('Photo captured:', photo.uri);

      const userMessage = { text: 'Fotoğraf gönderildi!', isUser: true, image: photo.uri };
      setMessages(prev => [...prev, userMessage]);

      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      console.log('FormData prepared:', formData);

      const response = await fetch(`${SERVER_URL}/camera`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok && data.response) {
        const aiResponse = { text: data.response, isUser: false };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || 'Sunucu hatası');
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert(
        'Hata',
        'Fotoğraf gönderilemedi. Sunucu bağlantısını veya kamera izinlerini kontrol edin: ' + SERVER_URL
      );
      const errorResponse = { text: 'Üzgünüm, fotoğraf işlenemedi.', isUser: false };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsCameraActive(false);
      setIsCameraReady(false);
      setCameraKey(prev => prev + 1);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kamera ve mikrofon izinleri yükleniyor...</Text>
      </View>
    );
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kamera veya mikrofona erişim izni yok. Lütfen cihaz ayarlarından izni verin.</Text>
      </View>
    );
  }

  console.log('Camera component:', Camera);

  return (
    <LinearGradient
      colors={['#E0F7FA', '#F0F4F8']}
      style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <View style={styles.headerContent}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Mesajlarda ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                placeholderTextColor="#FFF"
              />
              <Pressable
                onPress={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>{chatbotCharacter.name} ile Sohbet</Text>
              <Pressable onPress={() => setShowSearch(true)}>
                <Ionicons name="search" size={24} color="#FFF" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.videoContainer}>
        <View style={styles.mainVideo}>
          <Image source={chatbotCharacter.image} style={styles.botVideo} />
        </View>
        {hasCameraPermission && isCameraActive && Platform.OS !== 'web' && typeof Camera === 'function' ? (
          <View style={styles.userVideo}>
            <Camera
              key={cameraKey}
              ref={cameraRef}
              style={styles.camera}
              type="front"
              onCameraReady={() => {
                console.log('Camera is ready, ref:', cameraRef.current);
                setIsCameraReady(true);
              }}
              onMountError={(error) => {
                console.error('Camera mount error:', error);
                Alert.alert('Hata', 'Kamera başlatılamadı: ' + error.message);
                setIsCameraActive(false);
                setIsCameraReady(false);
              }}
            />
          </View>
        ) : (
          isCameraActive && (
            <View style={styles.userVideo}>
              <Text style={styles.errorText}>Kamera yüklenemedi. Lütfen uygulamayı yeniden başlatın.</Text>
            </View>
          )
        )}
        <Pressable onPress={handleCameraAction} style={styles.cameraButton}>
          <Ionicons
            name={isCameraActive ? 'camera-outline' : 'camera'}
            size={24}
            color="#FFF"
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {filteredMessages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {message.image && (
                <Image
                  source={{ uri: message.image }}
                  style={styles.messageImage}
                  onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                />
              )}
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Pressable
            onPress={handleMicrophoneToggle}
            style={[
              styles.microphoneButton,
              isRecording && styles.microphoneButtonRecording,
              isProcessing && styles.microphoneButtonProcessing,
            ]}
            disabled={isProcessing}
          >
            <Ionicons
              name={isProcessing ? 'refresh-circle' : isRecording ? 'stop-circle' : 'mic'}
              size={24}
              color="#FFF"
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Bir şeyler yaz..."
            placeholderTextColor="#999"
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 76,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  loadingText: {
    fontSize: 16,
    color: '#2D3436',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
  videoContainer: {
    width: '100%',
    height: height * 0.35,
    backgroundColor: '#2D3436',
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
  userVideo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  camera: {
    flex: 1,
  },
  errorText: {
    color: '#FFF',
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
  },
  microphoneButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FF6B6B',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  microphoneButtonRecording: {
    backgroundColor: '#D81B60',
  },
  microphoneButtonProcessing: {
    backgroundColor: '#FFD700',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#2D3436',
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#4A90E2',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 