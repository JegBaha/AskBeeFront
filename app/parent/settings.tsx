import { StyleSheet, View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

// Mock settings data
const settingsOptions = [
  {
    id: 'notifications',
    title: 'Bildirimler',
    icon: 'notifications-outline',
    type: 'switch',
  },
  {
    id: 'language',
    title: 'Dil',
    icon: 'language-outline',
    type: 'select',
    value: 'Türkçe',
  },
  {
    id: 'theme',
    title: 'Tema',
    icon: 'color-palette-outline',
    type: 'select',
    value: 'Açık',
  },
  {
    id: 'data-usage',
    title: 'Veri Kullanımı',
    icon: 'cloud-download-outline',
    type: 'switch',
  },
];

export default function Settings() {
  const [settingsState, setSettingsState] = useState({
    notifications: true,
    'data-usage': false,
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
        styles.settingItem,
        pressed && styles.settingItemPressed,
      ]}
      onPress={() => {
        if (item.type === 'select') {
          router.push(`/parent/settings/${item.id}`);
        }
      }}
    >
      <LinearGradient
        colors={['#FFF', '#F0F4F8']}
        style={styles.settingContent}
      >
        <Ionicons name={item.icon} size={24} color="#4A90E2" style={styles.settingIcon} />
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.type === 'select' && (
            <Text style={styles.settingValue}>{item.value}</Text>
          )}
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
          <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
        )}
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.settingsContainer}>
            {settingsOptions.map(renderSettingItem)}
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 20,
  },
  settingsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  settingItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
    lineHeight: 22,
  },
  settingValue: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
});