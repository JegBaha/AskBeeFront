import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions, Platform, Image, TextInput } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const activities = [
  {
    id: 'daily',
    title: 'Günün Görevleri',
    description: 'Bugünün özel aktiviteleri',
    color: '#FF9F43',
    gradient: ['#FFB347', '#FF9F43'],
    icon: 'calendar',
    image: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=400&q=80',
  },
  {
    id: 'cartoon',
    title: 'Çizgi Film',
    description: 'Kendi filmini yarat',
    color: '#FF6B6B',
    gradient: ['#FF8787', '#FF6B6B'],
    icon: 'film',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
  },
  {
    id: 'discover',
    title: 'Çevremizi Keşfedelim',
    description: 'Yeni şeyler keşfet',
    color: '#4A90E2',
    gradient: ['#5C9CE6', '#4A90E2'],
    icon: 'search',
    image: 'https://images.unsplash.com/photo-1459478309853-2c33a60058e7?w=400&q=80',
  },
  {
    id: 'learn',
    title: 'Birlikte Öğrenelim',
    description: 'Eğlenceli aktiviteler',
    color: '#98D8AA',
    gradient: ['#A8E0B9', '#98D8AA'],
    icon: 'book',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
  },
];

export default function HomeScreen() {
  const [isParentMode, setIsParentMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);

  const loadAvatar = async () => {
    try {
      const uri = await AsyncStorage.getItem('avatarImage');
      console.log('Home: Loading avatar from AsyncStorage, URI:', uri || 'null');
      if (uri) {
        // Normalize URI for cross-platform compatibility
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

  // Load avatar on mount
  useEffect(() => {
    loadAvatar();
  }, []);

  // Reload avatar when screen is focused
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
              <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
            )}
          </Pressable>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Aktivite ara..."
              placeholderTextColor="#999"
            />
          </View>
          <Pressable onPress={handleParentModeToggle} style={styles.modeButton}>
            <Text style={styles.modeText}>{isParentMode ? 'Ebeveyn' : 'Çocuk'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.beeContainer}>
          <Pressable onPress={() => router.push('/characterselection')}>
            <Image
              source={{ uri: './assets/bee.png' }}
              style={styles.beeImage}
            />
          </Pressable>
          <Text style={styles.welcomeText}>Bugün Ne Yapmak İstersin?</Text>
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
                        <Ionicons name={activity.icon} size={32} color="#FFFFFF" />
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#E3F2FD', 
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  modeButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeText: {
    color: '#4A90E2',
    fontWeight: 'bold',
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
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'cyan',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});