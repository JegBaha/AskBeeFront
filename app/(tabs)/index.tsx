import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions, Platform, Image, TextInput } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen2 from './LoadingScreen2';

const { width } = Dimensions.get('window');
const animals = [
  { name: 'Tavşan', image: require('/assets/rabbit.png'), backgroundColor: '#FF6B6B' },
  { name: 'bee', image: require('/assets/bee.png'), backgroundColor: '#FFD93D' },
  { name: 'Kedi', image: require('/assets/laughing.png'), backgroundColor: '#4A90E2' },
  { name: 'Kurbağa', image: require('/assets/turtle.png'), backgroundColor: '#6BCB77' },
];
const activities = [
  {
    id: 'Daily',
    title: 'Görevler',
    description: 'Bugünün özel aktiviteleri',
    color: '#FF9F43',
    gradient: ['#FFD180', '#FF9F43'],
    icon: 'calendar',
    image: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=400&q=80',
  },
  {
    id: 'cartoon',
    title: 'Masal',
    description: 'Kendi Masalını yarat',
    color: '#FF6B6B',
    gradient: ['#FF8A80', '#FF6B6B'],
    icon: 'film',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  },
  {
    id: 'cartoonfilm',
    title: 'Çizgi Film',
    description: 'Kendi Çizgi Filmini Yarat',
    color: '#4A90E2',
    gradient: ['#80D8FF', '#4A90E2'],
    icon: 'search',
    image: 'https://images.unsplash.com/photo-1459478309853-2c33a60058e7?w=400&q=80',
  },
  {
    id: 'learn',
    title: 'Birlikte Öğrenelim',
    description: 'Eğlenceli aktiviteler',
    color: '#98D8AA',
    gradient: ['#B9FBC0', '#98D8AA'],
    icon: 'book',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
  },
];

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isParentMode, setIsParentMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const loadAvatar = async () => {
    try {
      const uri = await AsyncStorage.getItem('avatarImage');
      console.log('Home: Loading avatar from AsyncStorage, URI:', uri || 'null');
      if (uri) {
        const normalizedUri = Platform.OS === 'android' && !uri.startsWith('file://') ? `file://${uri}` : uri;
        setAvatarImage(normalizedUri);
        console.log('Home: Avatar state updated with URI:', normalizedUri);
      } else {
        console.log('Home: No avatar URI found in AsyncStorage');
      }
    } catch (err) {
      console.error('Home: Error loading avatar from AsyncStorage:', err);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  useFocusEffect(() => {
    console.log('Home: Screen focused, reloading avatar');
    loadAvatar();
  });

  const handleParentModeToggle = () => {
    if (!isParentMode) {
      router.push('/parent-auth');
    } else {
      setIsParentMode(false);
    }
  };

  const handleProfilePress = () => {
    console.log('Home: Navigating to profile, current avatar URI:', avatarImage || 'null');
    router.push('/profile');
  };

  if (isLoading) {
    return <LoadingScreen2 />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={handleProfilePress} style={styles.profileButton}>
            {avatarImage ? (
              <Image
                source={{ uri: avatarImage, cache: 'reload' }}
                style={styles.profileImage}
                onError={(e) => console.log('Home: Image load error:', e.nativeEvent.error)}
              />
            ) : (
              <Ionicons name="person-circle" size={40} color="#FFF" />
            )}
          </Pressable>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#FFF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Aktivite ara..."
              placeholderTextColor="#FFF"
            />
          </View>
          <Pressable onPress={handleParentModeToggle} style={styles.modeButton}>
            <Ionicons name={isParentMode ? 'lock-open' : 'lock-closed'} size={20} color="#FFF" />
            <Text style={styles.modeText}>{isParentMode ? 'Ebeveyn' : 'Çocuk'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.beeContainer}>
          <Pressable onPress={() => router.push('/characterselection')}>
            <Image
              source={animals.find(animal => animal.name === 'bee').image} 
              style={styles.beeImage}
            />
          </Pressable>
          <Text style={styles.welcomeText}>Bugün Ne Yapalım?</Text>
        </View>

        <View style={styles.activitiesContainer}>
          {activities
            .filter(activity => 
              activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              activity.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((activity) => (
              <Pressable
                key={activity.id}
                style={styles.activityCard}
                onPress={() => router.push(`/${activity.id}`)}>
                <LinearGradient
                  colors={activity.gradient}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <View style={styles.activityContent}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={{ uri: activity.image }}
                        style={styles.activityImage}
                      />
                      <View style={styles.iconOverlay}>
                        <Ionicons name={activity.icon} size={28} color="#FFF" />
                      </View>
                    </View>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </View>
                </LinearGradient>
              </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#5C9CE6',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C9CE6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  beeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  beeImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#E0F7FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginTop: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  activityCard: {
    width: (width - 56) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 20,
  },
  activityContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});