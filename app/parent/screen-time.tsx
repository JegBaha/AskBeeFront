import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const activities = [
  { name: 'Görevler', time: 5 },
  { name: 'Sesli Sohbet', time: 10 },
  { name: 'Çizgi Film', time: 15 },
  { name: 'Eğitim', time: 30 },
];

const completedStats = {
  viewed: 25,
  completed: 3,
};

export default function ScreenTimeActivities() {
  const [screenTime, setScreenTime] = useState(0); // Time in seconds
  const maxTime = Math.max(...activities.map(a => a.time));

  // Load saved screen time on mount
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

  // Real-time screen time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setScreenTime(prev => {
        const newTime = prev + 1;
        // Save to AsyncStorage
        AsyncStorage.setItem('screenTime', newTime.toString()).catch(error => {
          console.error('Error saving screen time:', error);
        });
        // Check for 45 minutes (2700 seconds)
        if (newTime >= 2700) {
          router.push('/take-break');
          // Optionally reset screen time
          AsyncStorage.setItem('screenTime', '0').catch(error => {
            console.error('Error resetting screen time:', error);
          });
          return 0; // Reset after navigation
        }
        return newTime;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Format time as hours, minutes, and seconds
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}sa ${minutes}d ${secs}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#2D3436" 
            onPress={() => router.back()} 
          />
          <Text style={styles.headerTitle}>Ask Bee</Text>
          <View style={styles.profileIcon} />
        </View>
        
        <View style={styles.dateSelector}>
          <Text style={[styles.dateOption, styles.dateActive]}>Hafta</Text>
          <Text style={styles.dateOption}>Gün</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bugün, Toplam Ekran Süresi</Text>
          <Text style={styles.totalTime}>{formatTime(screenTime)}</Text>
          
          <View style={styles.chart}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>{activity.time}</Text>
                </View>
                <View style={[styles.bar, { height: (activity.time / maxTime) * 200 }]} />
                <Text style={styles.barLabel}>{activity.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yapılan Aktiviteler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.statsContainer}>
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  profileIcon: {
    width: 24,
    height: 24,
  },
  dateSelector: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  dateOption: {
    fontSize: 16,
    color: '#94A3B8',
  },
  dateActive: {
    color: '#0EA5E9',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 250,
    paddingTop: 30,
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
    color: '#64748B',
  },
  bar: {
    width: 30,
    backgroundColor: '#0EA5E9',
    borderRadius: 15,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});