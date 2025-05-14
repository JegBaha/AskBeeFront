import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for completed tasks
const completedTasks = [
  {
    id: '1',
    title: 'Odanı Topla',
    date: '17 Nisan 2025',
    status: 'Tamamlandı',
  },
  {
    id: '2',
    title: 'Matematik Ödevi',
    date: '14 Nisan 2025',
    status: 'Tamamlandı',
  },
  {
    id: '3',
    title: 'Bitki Sulama',
    date: '12 Nisan 2025',
    status: 'Tamamlandı',
  },
];

export default function CompletedTasks() {
  const renderTaskItem = ({ item }: { item: typeof completedTasks[0] }) => (
    <Pressable
      style={({ pressed }) => [
        styles.taskItem,
        pressed && styles.taskItemPressed,
      ]}
      onPress={() => router.push(`/parent/completed-tasks/${item.id}`)}
    >
      <LinearGradient
        colors={['#FFF', '#F0F4F8']}
        style={styles.taskContent}
      >
        <Ionicons name="checkmark-done-outline" size={24} color="#4A90E2" style={styles.taskIcon} />
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDate}>{item.date}</Text>
        </View>
        <Text style={styles.statusText}>{item.status}</Text>
        <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Tamamlanan Görevler</Text>
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
            data={completedTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done-outline" size={48} color="#4A90E2" />
                <Text style={styles.emptyText}>Henüz tamamlanmış görev yok.</Text>
                <Text style={styles.emptySubText}>
                  Çocuğunuzun görevlerini buradan takip edin!
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
  taskItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  taskItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    lineHeight: 22,
  },
  taskDate: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  statusText: {
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
    color: '#636E72',
    marginTop: 8,
    textAlign: 'center',
  },
});