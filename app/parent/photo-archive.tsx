import { StyleSheet, View, Text, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for photo archive with random Unsplash images
const photoArchive = [
  {
    id: '1',
    title: 'Sanat Etkinliği Çizimi',
    date: '15 Nisan 2025',
    image: 'https://images.unsplash.com/photo-1513366208864-87536b8bd7b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    title: 'Matematik Çalışması',
    date: '12 Nisan 2025',
    image: 'https://images.unsplash.com/photo-1509228468518-508d1a79dd0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    title: 'Doğa Gözlemi',
    date: '10 Nisan 2025',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

export default function PhotoArchive() {
  const renderPhotoItem = ({ item }: { item: typeof photoArchive[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.photoItem,
        pressed && styles.photoItemPressed,
      ]}
      onPress={() => router.push(`/parent/photo-archive/${item.id}`)}
    >
      <LinearGradient
        colors={['#FFF', '#F0F4F8']}
        style={styles.photoContent}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.photoImage}
        />
        <View style={styles.photoInfo}>
          <Text style={styles.photoTitle}>{item.title}</Text>
          <Text style={styles.photoDate}>{item.date}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Taratılan Fotoğraf Arşivi</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.listContainer}>
          <FlatList
            data={photoArchive}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="images-outline" size={48} color="#4A90E2" />
                <Text style={styles.emptyText}>Henüz taratılmış fotoğraf yok.</Text>
                <Text style={styles.emptySubText}>
                  Çocuğunuzun çalışmalarını taratmaya başlayın!
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  photoItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  photoItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  photoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  photoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  photoInfo: {
    flex: 1,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    lineHeight: 22,
  },
  photoDate: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D3436',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 8,
    textAlign: 'center',
  },
});