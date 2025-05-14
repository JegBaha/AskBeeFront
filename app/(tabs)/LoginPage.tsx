import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  

  const handleLogin = () => {
    if (!email || !password) {
      alert('Lütfen ad ve şifrenizi girin.');
      return;
    }
    if (email === 'Baa' && password === '1234') {
      alert('Giriş başarılı!');
      router.push('/index');
    } else {
      alert('Geçersiz ad veya şifre.');
    }
  };

  const handleRegisterPress = () => {
    router.push('/SignUpPage');
  };

  const handleForgotPassword = () => {
    alert('Şifre sıfırlama özelliği henüz uygulanmadı.');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={['#80D8FF', '#4A90E2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Image source={require('../../assets/images/ari1.png')} style={styles.beeImage} />
            <Text style={styles.welcomeText}>Haydi Hep Birlikte Eğlenerek Öğrenelim!</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.form}>
            <TextInput
              label="Ad"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="default"
              theme={{ colors: { primary: '#4A90E2', background: '#FFF' } }}
            />
            <TextInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#4A90E2', background: '#FFF' } }}
            
            />
          </View>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={['#FFD180', '#FF9F43']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Giriş Yap</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.registerButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleRegisterPress}
            >
              <LinearGradient
                colors={['#FF8A80', '#FF6B6B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </Pressable>

            <Text style={styles.registerText}>
              Hesabın Yok Mu?{' '}
              <Text style={styles.registerLink} onPress={handleRegisterPress}>
                Kayıt Ol
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
  },
  beeImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#E0F7FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    width: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  registerButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  registerText: {
    color: '#2D3436',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  registerLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default LoginPage;