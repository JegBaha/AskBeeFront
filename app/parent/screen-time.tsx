import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const activities = [
  { name: 'Görevler', time: 5, icon: 'checkbox-outline' },
  { name: 'Sesli Sohbet', time: 10, icon: 'mic-outline' },
  { name: 'Çizgi Film', time: 15, icon: 'film-outline' },
  { name: 'Eğitim', time: 30, icon: 'school-outline' },
];

const completedStats = {
  viewed: 25,
  completed: 3,
};

export default function ScreenTimeActivities() {
  const [screenTime, setScreenTime] = useState(0);
  const maxTime = Math.max(...activities.map(a => a.time));

  useEffect(() => {
    const loadScreenTime = async () => {
      try {
        const savedTime = await AsyncStorage.getItem('screenTime');
        if (savedTime !== null) {
          setScreenTime(parseInt(savedTime, 10));
        }
      } catch (error) {
        console.error('Error loading screen time:', error);
      }
    };
    loadScreenTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScreenTime(prev => {
        const newTime = prev + 1;
        AsyncStorage.setItem('screenTime', newTime.toString()).catch(error => {
          console.error('Error saving screen time:', error);
        });
        if (newTime >= 90) {
          router.push('/Mola');
          AsyncStorage.setItem('screenTime', '0').catch(error => {
            console.error('Error resetting screen time:', error);
          });
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}sa ${minutes}d ${secs}s`;
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4F8']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ekran Süresi</Text>
        </View>
        <View style={styles.dateSelector}>
          <TouchableOpacity>
            <Text style={styles.dateOption}>Hafta</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.dateOption, styles.dateActive]}>Gün</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bugün, Toplam Ekran Süresi</Text>
          <Text style={styles.totalTime}>{formatTime(screenTime)}</Text>
          <View style={styles.chart}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>{activity.time}</Text>
                </View>
                <LinearGradient
                  colors={['#4A90E2', '#80D8FF']}
                  style={[styles.bar, { height: (activity.time / maxTime) * 180 }]}
                />
                <View style={styles.activityLabel}>
                  <Ionicons name={activity.icon} size={20} color="#2D3436" />
                  <Text style={styles.barLabel}>{activity.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Yapılan Aktiviteler</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedStats.viewed}</Text>
              <Text style={styles.statLabel}>Görsel Taratıldı</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedStats.completed}</Text>
              <Text style={styles.statLabel}>Görev Tamamlandı</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dateSelector: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  dateOption: {
    fontSize: 16,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  dateActive: {
    backgroundColor: '#FF6B6B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  totalTime: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 220,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  barLabelContainer: {
    marginBottom: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
  },
  bar: {
    width: 40,
    borderRadius: 8,
    marginBottom: 12,
  },
  activityLabel: {
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D3436',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statCard: {
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
    textAlign: 'center',
  },
});