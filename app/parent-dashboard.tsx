import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
const icons = [
  { name: 'child', image: require('/assets/child.png'), backgroundColor: '#FF6B6B' },

];
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
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>E</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Ebeveyn Paneline Hoşgeldin</Text>
              <Text style={styles.subText}>Miniğin neler yaptığına göz at!</Text>
            </View>
          </View>
          <Pressable 
            style={styles.closeButton}
            onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <Image
            source={icons.find(animal => animal.name === 'child').image}
            style={styles.mascotImage}
          />
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.push(`/parent/${item.id}`)}>
              <LinearGradient
                colors={['#FFF', '#F0F4F8']}
                style={styles.menuContent}>
                <Ionicons name={item.icon} size={24} color="#4A90E2" style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
              </LinearGradient>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 24,
  },
  subText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginTop: 4,
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
    alignItems: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mascotImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F7FA',
    borderWidth: 3,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  menuItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    flex: 1,
    lineHeight: 22,
  },
  settingsSection: {
    marginTop: 28,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'left',
  },
  settingsButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
});