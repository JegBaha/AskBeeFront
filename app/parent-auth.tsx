import { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ParentAuthScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const correctPin = '1234';

  const handleSubmit = () => {
    if (pin === correctPin) {
      router.push('/parent-dashboard');
    } else {
      setError('Yanlış PIN kodu. Lütfen tekrar deneyin.');
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </Pressable>
        <Text style={styles.headerTitle}>Ebeveyn Girişi</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>PIN Kodunu Girin</Text>
        <Text style={styles.subtitle}>Ebeveyn paneline erişmek için PIN kodunu girin</Text>
        
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          placeholder="• • • •"
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
        />
        
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        <Pressable
          style={[styles.button, !pin && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!pin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 280,
    height: 60,
    borderRadius: 16,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    maxWidth: 280,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});