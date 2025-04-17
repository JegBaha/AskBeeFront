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

const { width, height } = Dimensions.get('window');

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(Platform.OS !== 'web');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        const audioStatus = await Audio.requestPermissionsAsync();
        setHasPermission(cameraStatus.status === 'granted' && audioStatus.status === 'granted');
        if (cameraStatus.status !== 'granted' || audioStatus.status !== 'granted') {
          console.log('İzinler eksik:', { camera: cameraStatus.status, audio: audioStatus.status });
        }
      } catch (error) {
        console.error('İzin alınırken hata:', error);
        setHasPermission(false);
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://192.168.192.162:5000/chat', {
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
      console.error('API isteği sırasında hata:', error);
      const errorResponse = { text: 'Üzgünüm, bir hata oluştu.', isUser: false };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await Audio.requestPermissionsAsync();
      if (hasPermission.status !== 'granted') {
        Alert.alert('Hata', 'Mikrofon izni gerekli!');
        return;
      }

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

    
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      });
      console.log('FormData prepared for upload');

     
      console.log('Sending audio to backend...');
      const response = await fetch('http://192.168.64.162:5000/transcribe', {
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

  const handleMicrophoneToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  const filteredMessages = messages.filter(message =>
    message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Kamera ve mikrofon izinleri yükleniyor...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Kamera veya mikrofona erişim izni yok. Lütfen cihaz ayarlarından izni verin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Mesajlarda ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <Pressable
                onPress={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="close" size={24} color="#636E72" />
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>{chatbotCharacter.name}</Text>
              <Pressable onPress={() => setShowSearch(true)}>
                <Ionicons name="search" size={24} color="#636E72" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.videoContainer}>
        <View style={styles.mainVideo}>
          <Image source={chatbotCharacter.image} style={styles.botVideo} />
        </View>
        {hasPermission && isCameraActive && Platform.OS !== 'web' && Platform.OS !== 'android' && (
          <View style={styles.userVideo}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type="front"
            />
          </View>
        )}
        <Pressable onPress={toggleCamera} style={styles.cameraToggleButton}>
          <Ionicons
            name={isCameraActive ? 'videocam-off' : 'videocam'}
            size={24}
            color="#FFFFFF"
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
                <Image source={{ uri: message.image }} style={styles.messageImage} />
              )}
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Pressable onPress={handleMicrophoneToggle} style={styles.microphoneButton}>
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={24}
              color={isRecording ? "#4A90E2" : "#999"}
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
            <Ionicons name="send" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 76,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  videoContainer: {
    width: '100%',
    height: height * 0.4,
    backgroundColor: '#000',
    position: 'relative',
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
  },
  userVideo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  microphoneButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cameraToggleButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#2D3436',
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    color: '#2D3436',
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