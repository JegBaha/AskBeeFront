import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

const NewAccount2: React.FC = () => {
  const [beeName, setBeeName] = useState('');

  const handleStart = () => {
    if (beeName) {
      router.push({ pathname: '/TutorialPage', params: { beeName } }); // TutorialPage'e yönlendir
    } else {
      alert('Lütfen arınızın adını girin.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/kovan1.png')} style={styles.kovanImage} />
      <Text style={styles.title}>Minik Arımızın İsmi Nedir ?</Text>
      <TextInput
        style={styles.input}
        placeholder="İsim"
        value={beeName}
        onChangeText={setBeeName}
      />
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Haydi Başlayalım!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92c7f0', // Hafif mavi, index.tsx ile uyumlu
    paddingHorizontal: 20,
  },
  kovanImage: {
    width: 300,
    height: 300,
    marginBottom: 30,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#FFD700', // index.tsx beeImage kenarlığı
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3436', // index.tsx welcomeText rengi
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  startButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#5C9CE6', // index.tsx modeButton rengi
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // index.tsx header metin rengi
  },
});

export default NewAccount2;