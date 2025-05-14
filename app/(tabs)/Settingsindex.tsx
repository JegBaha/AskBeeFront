import { StyleSheet, View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

// Mock settings data
const settingsOptions = [
  {
    id: 'notifications',
    title: 'Bildirimler',
    description: 'Aktivite ve görev hatırlatıcıları',
    icon: 'notifications-outline',
    type: 'switch',
  },
  {
    id: 'language',
    title: 'Dil',
    description: 'Uygulama dilini değiştir',
    icon: 'language-outline',
    type: 'select',
    value: 'Türkçe',
  },
  {
    id: 'theme',
    title: 'Tema',
    description: 'Açık veya koyu tema seç',
    icon: 'color-palette-outline',
    type: 'select',
    value: 'Açık',
  },
  {
    id: 'sound',
    title: 'Ses Efektleri',
    description: 'Uygulama seslerini aç/kapat',
    icon: 'volume-high-outline',
    type: 'switch',
  },
];

export default function SettingsIndex() {
  const [settingsState, setSettingsState] = useState({
    notifications: true,
    sound: true,
  });

  const toggleSwitch = (id: string) => {
    setSettingsState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderSettingItem = (item: typeof settingsOptions[0]) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.settingCard,
        pressed && styles.settingCardPressed,
      ]}
      onPress={() => {
        if (item.type === 'select') {
          router.push(`/settings/${item.id}`);
        }
      }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F0F4F8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.settingContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={28} color="#4A90E2" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          {item.type === 'switch' ? (
            <Switch
              trackColor={{ false: '#B0BEC5', true: '#4A90E2' }}
              thumbColor={settingsState[item.id] ? '#FFF' : '#FFF'}
              ios_backgroundColor="#B0BEC5"
              onValueChange={() => toggleSwitch(item.id)}
              value={settingsState[item.id]}
            />
          ) : (
            <View style={styles.selectContainer}>
              <Text style={styles.settingValue}>{item.value}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Ayarlar</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          {settingsOptions.map(renderSettingItem)}
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  settingCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    borderRadius: 20,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#636E72',
    opacity: 0.9,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#4A90E2',
    marginRight: 8,
    fontWeight: '600',
  },
});