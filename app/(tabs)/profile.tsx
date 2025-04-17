import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Image, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Audio from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const animals = [
  {
    id: 'rabbit',
    name: 'Tavşan',
    image: './assets/rabbit.png',
    defaultSound: 'https://example.com/rabbit.mp3',
  },
  {
    id: 'bee',
    name: 'Arı',
    image: './assets/bee.png',
    defaultSound: 'https://example.com/bee.mp3',
  },
  {
    id: 'cat',
    name: 'Kedi',
    image: './assets/laughing.png',
    defaultSound: 'https://example.com/cat.mp3',
  },
  {
    id: 'frog',
    name: 'Kurbağa',
    image: './assets/turtle.png',
    defaultSound: 'https://example.com/frog.mp3',
  },
];

export default function ProfileScreen() {
  const [userName, setUserName] = useState('Çocuk');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState({});
  const [selectedSound, setSelectedSound] = useState({});
  const [avatarImage, setAvatarImage] = useState(null);

  // Load avatarImage from AsyncStorage on mount
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const uri = await AsyncStorage.getItem('avatarImage');
        console.log('Profile: Loading avatar from AsyncStorage, URI:', uri || 'null');
        if (uri) {
          setAvatarImage(uri);
          console.log('Profile: Avatar state updated with URI:', uri);
        } else {
          console.log('Profile: No avatar URI found in AsyncStorage');
        }
      } catch (err) {
        console.error('Profile: Error loading avatar from AsyncStorage:', err);
      }
    };
    loadAvatar();
  }, []);

  const pickAvatarImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Profile: Media library permission status:', status);
      if (status !== 'granted') {
        alert('Galeri erişimi için izin gerekli!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('Profile: ImagePicker result:', JSON.stringify(result, null, 2));

      if (!result.canceled) {
        let uri = result.assets[0].uri;
        // Normalize URI for cross-platform compatibility
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = `file://${uri}`;
        }
        console.log('Profile: Selected avatar URI:', uri);
        setAvatarImage(uri);
        console.log('Profile: Avatar state updated with URI:', uri);
        try {
          await AsyncStorage.setItem('avatarImage', uri);
          console.log('Profile: Avatar successfully saved to AsyncStorage with URI:', uri);
        } catch (err) {
          console.error('Profile: Error saving avatar to AsyncStorage:', err);
        }
      } else {
        console.log('Profile: Image selection canceled');
      }
    } catch (err) {
      console.error('Profile: Error picking avatar image:', err);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording || !selectedAnimal) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        setSelectedSound({
          ...selectedSound,
          [selectedAnimal.id]: { type: 'recorded', uri }
        });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const pickSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (!result.canceled && selectedAnimal) {
        setSelectedSound({
          ...selectedSound,
          [selectedAnimal.id]: { type: 'picked', uri: result.assets[0].uri }
        });
      }
    } catch (err) {
      console.error('Error picking sound:', err);
    }
  };

  const useDefaultSound = () => {
    if (selectedAnimal) {
      setSelectedSound({
        ...selectedSound,
        [selectedAnimal.id]: { type: 'default', uri: selectedAnimal.defaultSound }
      });
    }
  };

  const playSound = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play sound:', err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} dakika`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil 👤</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <Pressable onPress={pickAvatarImage} style={styles.avatarContainer}>
            {avatarImage ? (
              <Image
                source={{ uri: avatarImage, cache: 'reload' }}
                style={styles.avatarImage}
                onError={(e) => console.log('Profile: Image load error:', e.nativeEvent.error)}
              />
            ) : (
              <Ionicons name="happy" size={60} color="#FF6B6B" />
            )}
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </Pressable>
          
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="İsminizi girin"
              />
              <Pressable style={styles.saveButton} onPress={() => {
                setUserName(newName);
                setIsEditing(false);
              }}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Text style={styles.profileName}>{userName} ✏️</Text>
            </Pressable>
          )}
          
          <Text style={styles.levelText}>Seviye 1 🏆</Text>

          <Pressable
            style={styles.characterButton}
            onPress={() => setShowCharacterModal(true)}>
            <Text style={styles.characterButtonText}>Karakteri Düzenle 🐾</Text>
          </Pressable>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Bugünkü İstatistikler 📊</Text>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Öğrenme Süresi:</Text>
              <Text style={styles.statValue}>0 dakika 📚</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sohbet Süresi:</Text>
              <Text style={styles.statValue}>0 dakika 💭</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Keşif Süresi:</Text>
              <Text style={styles.statValue}>0 dakika 🔍</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Character Selection Modal */}
      <Modal
        visible={showCharacterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCharacterModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Karakterini Seç</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowCharacterModal(false)}>
                <Ionicons name="close" size={24} color="#636E72" />
              </Pressable>
            </View>

            <View style={styles.animalsGrid}>
              {animals.map((animal) => (
                <Pressable
                  key={animal.id}
                  style={styles.animalCard}
                  onPress={() => {
                    setSelectedAnimal(animal);
                    setShowCharacterModal(false);
                    setShowSoundModal(true);
                  }}>
                  <Image source={{ uri: animal.image }} style={styles.animalImage} />
                  <Text style={styles.animalName}>{animal.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Sound Selection Modal */}
      <Modal
        visible={showSoundModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSoundModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedAnimal?.name} Sesi
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowSoundModal(false)}>
                <Ionicons name="close" size={24} color="#636E72" />
              </Pressable>
            </View>

            <View style={styles.soundOptions}>
              <Pressable
                style={styles.soundOption}
                onPress={useDefaultSound}>
                <Ionicons name="musical-note" size={24} color="#4A90E2" />
                <Text style={styles.soundOptionText}>Varsayılan Sesi Kullan</Text>
              </Pressable>

              <Pressable
                style={styles.soundOption}
                onPress={pickSound}>
                <Ionicons name="folder-open" size={24} color="#4A90E2" />
                <Text style={styles.soundOptionText}>Telefondan Ses Seç</Text>
              </Pressable>

              <Pressable
                style={[styles.soundOption, isRecording && styles.recordingOption]}
                onPress={isRecording ? stopRecording : startRecording}>
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={24}
                  color={isRecording ? "#FF6B6B" : "#4A90E2"}
                />
                <Text style={styles.soundOptionText}>
                  {isRecording ? 'Kaydı Durdur' : 'Kendi Sesini Kaydet'}
                </Text>
              </Pressable>

              {selectedSound[selectedAnimal?.id] && (
                <Pressable
                  style={styles.playButton}
                  onPress={() => playSound(selectedSound[selectedAnimal.id].uri)}>
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                  <Text style={styles.playButtonText}>Sesi Çal</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 24,
  },
  characterButton: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  characterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  animalCard: {
    width: '48%',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  animalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  animalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  soundOptions: {
    gap: 12,
  },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  recordingOption: {
    backgroundColor: '#FFE5E5',
  },
  soundOptionText: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#636E72',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 8,
    fontSize: 20,
    marginRight: 8,
    minWidth: 150,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});