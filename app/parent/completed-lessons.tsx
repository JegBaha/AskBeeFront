import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for completed lessons
const completedLessons = [
  {
    id: '1',
    title: 'Temel Matematik: Toplama',
    date: '14 Nisan 2025',
    progress: '100%',
  },
  {
    id: '2',
    title: 'Okuma: İlk Kelimeler',
    date: '10 Nisan 2025',
    progress: '100%',
  },
  {
    id: '3',
    title: 'Bilim: Bitki Yaşam Döngüsü',
    date: '8 Nisan 2025',
    progress: '100%',
  },
];

export default function CompletedLessons() {
  const renderLessonItem = ({ item }: { item: typeof completedLessons[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.lessonItem,
        pressed && styles.lessonItemPressed,
      ]}
      onPress={() => router.push(`/parent/completed-lessons/${item.id}`)}
    >
      <LinearGradient
        colors={['#FFF', '#F0F4F8']}
        style={styles.lessonContent}
      >
        <Ionicons name="school-outline" size={24} color="#4A90E2" style={styles.lessonIcon} />
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDate}>{item.date}</Text>
        </View>
        <Text style={styles.progressText}>{item.progress}</Text>
        <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Tamamlanan Eğitimler</Text>
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
            data={completedLessons}
            renderItem={renderLessonItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="school-outline" size={48} color="#4A90E2" />
                <Text style={styles.emptyText}>Henüz tamamlanmış eğitim yok.</Text>
                <Text style={styles.emptySubText}>
                  Çocuğunuzun eğitimlerini tamamlamasını bekleyin!
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
  lessonItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  lessonItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lessonIcon: {
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    lineHeight: 22,
  },
  lessonDate: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    marginRight: 8,
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

    marginTop: 8,
    textAlign: 'center',
  },
});