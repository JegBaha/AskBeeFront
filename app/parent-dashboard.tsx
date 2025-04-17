import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const menuItems = [
  {
    id: 'screen-time',
    title: 'Ekran Süresi ve Aktiviteler',
    icon: 'time-outline',
  },
  {
    id: 'photo-archive',
    title: 'Taratılan Fotoğraf Arşivi',
    icon: 'images-outline',
  },
  {
    id: 'completed-lessons',
    title: 'Tamamlanılan Eğitimler',
    icon: 'school-outline',
  },
  {
    id: 'cartoon-history',
    title: 'Çizgi Film ve Masal Geçmişi',
    icon: 'film-outline',
  },
  {
    id: 'completed-tasks',
    title: 'Tamamlanılan Görevler',
    icon: 'checkmark-done-outline',
  },
];

export default function ParentDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>E</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Ebeveyn Paneline Hoşgeldin</Text>
              <Text style={styles.subText}>Haydi Miniğin neler yaptığına bir göz atalım</Text>
            </View>
          </View>
          <Pressable 
            style={styles.closeButton}
            onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#636E72" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <Image
            source={{ uri: '/assets/child.png' }}
            style={styles.mascotImage}
          />
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(`/parent/${item.id}`)}>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Uygulama İçi Tercihler</Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push('/parent/settings')}>
            <Ionicons name="settings-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingsText}>Ayarlar</Text>
            <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
          </Pressable>
        </View>
      </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  subText: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems:'center',
  },
  mascotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  mascotImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuTitle: {
    fontSize: 16,
    color: '#2D3436',
    flex: 1,
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  settingsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsText: {
    fontSize: 16,
    color: '#2D3436',
    marginLeft: 12,
    flex: 1,
  },
});