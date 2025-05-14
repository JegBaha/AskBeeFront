import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

// Sabit veri (hata durumunda yedek)
const fallbackTasks = [
  {
    id: '1',
    title: 'Matematik Ödevini Tamamla',
    description: 'Temel toplama alıştırmaları',
    completed: false,
  },
  {
    id: '2',
    title: 'Odanı Topla',
    description: 'Yatağını düzelt ve oyuncakları yerleştir',
    completed: true,
  },
  {
    id: '3',
    title: 'Bitkileri Sula',
    description: 'Bahçedeki çiçekleri kontrol et',
    completed: false,
  },
];

export default function Daily() {
  const BACKEND_URL = 'http://192.168.64.162:5000'; // Aynı ağdaki backend adresi
  const [phase, setPhase] = useState<'welcome' | 'questions' | 'tasks'>('welcome');
  const [questions, setQuestions] = useState<
    { category: string; text: string; choices: string[] }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [tasks, setTasks] = useState<
    { id: string; title: string; description: string; completed: boolean }[]
  >([]);
  const [classification, setClassification] = useState<string>('');

  // Soruları backend'den çek
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/questions`, {
        signal: AbortSignal.timeout(5000),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        throw new Error('Geçersiz soru formatı');
      }
    } catch (error: any) {
      console.error('Sorular alınamadı:', error);
      let errorMessage = 'Sorular yüklenemedi.';
      if (error.name === 'TimeoutError') errorMessage = 'Bağlantı zaman aşımına uğradı.';
      Alert.alert('Hata', errorMessage);
      setTasks(fallbackTasks);
      setPhase('tasks');
    }
  };

  // Cevapları gönder ve görevleri al
  const submitAnswers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
        signal: AbortSignal.timeout(10000),
      });
      const data = await response.json();
      if (data.classification && data.tasks) {
        setClassification(data.classification);
        setTasks(
          data.tasks.map((task: string, index: number) => ({
            id: `${index}`,
            title: task.split('.')[0], // İlk cümleyi başlık olarak al
            description: task,
            completed: false,
          }))
        );
        setPhase('tasks');
      } else {
        throw new Error(data.error || 'Görevler alınamadı');
      }
    } catch (error: any) {
      console.error('Cevap gönderme hatası:', error);
      let errorMessage = 'Görevler oluşturulamadı.';
      if (error.name === 'TimeoutError') errorMessage = 'Bağlantı zaman aşımına uğradı.';
      Alert.alert('Hata', errorMessage);
      setTasks(fallbackTasks);
      setPhase('tasks');
    }
  };

  // İlk yükleme
  useEffect(() => {
    if (phase === 'questions' && questions.length === 0) {
      fetchQuestions();
    }
  }, [phase]);

  // Görev tamamlanma durumunu değiştir
  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Cevap seçme
  const handleAnswer = (choice: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = choice;
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        submitAnswers();
      }
      return newAnswers;
    });
  };

  // Görev öğesi render
  const renderTaskItem = ({ item }: { item: typeof fallbackTasks[0] }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F0F4F8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.taskContent}>
          <View style={styles.iconContainer}>
            <Feather
              name={item.completed ? 'check-circle' : 'circle'}
              size={24}
              color={item.completed ? '#8B5CF6' : '#6B7280'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8B5CF6" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (phase === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Günün Görevleri</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Merhaba! İlgi alanlarına uygun görevler bulmak için birkaç soruya cevap ver!
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setPhase('questions')}
            >
              <Text style={styles.startButtonText}>Başla</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tasksContainer}>
          <Text style={styles.tasksHeader}>
            <Feather name="check-square" size={20} color="#0288D1" /> Görev Koleksiyonum
          </Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            style={styles.tasksList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyTasksText}>Henüz görev yok!</Text>
            }
          />
        </View>
      </View>
    );
  }

  if (phase === 'questions') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Günün Görevleri</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {questions.length > 0 && (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {questions[currentQuestionIndex].text}
              </Text>
              {questions[currentQuestionIndex].choices.map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.choiceButton}
                  onPress={() => handleAnswer(choice)}
                >
                  <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.tasksContainer}>
          <Text style={styles.tasksHeader}>
            <Feather name="check-square" size={20} color="#0288D1" /> Görev Koleksiyonum
          </Text>
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            style={styles.tasksList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyTasksText}>Henüz görev yok!</Text>
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Günün Görevleri</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.classificationText}>
          İlgi Alanın: {classification || 'Belirleniyor...'}
        </Text>
        <View style={styles.taskStatusContainer}>
          <Text style={styles.taskStatusText}>
            Tamamlanan Görevler: {tasks.filter((t) => t.completed).length} /{' '}
            {tasks.length}
          </Text>
        </View>
      </View>
      <View style={styles.tasksContainer}>
        <Text style={styles.tasksHeader}>
          <Feather name="check-square" size={20} color="#0288D1" /> Görev Koleksiyonum
        </Text>
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="check-square" size={48} color="#8B5CF6" />
              <Text style={styles.emptyText}>Bugün için görev yok!</Text>
              <Text style={styles.emptySubText}>
                Yeni görevler için sorulara cevap ver.
              </Text>
            </View>
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#8B5CF6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
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
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0288D1',
    textAlign: 'center',
    marginBottom: 20,
  },
  choiceButton: {
    backgroundColor: '#EDE9FE',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Poppins',
  },
  classificationText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 20,
  },
  taskStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  taskStatusText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  tasksContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1',
    marginBottom: 10,
    textAlign: 'center',
  },
  tasksList: {
    flexGrow: 0,
  },
  taskCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 20,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Poppins',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTasksText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});