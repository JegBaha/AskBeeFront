import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function TakeBreak() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir Mola Ver!</Text>
      <Text style={styles.message}>
        45 dakika boyunca uygulamayı kullandın. Biraz dinlenmeye ne dersin?
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push('/')} // Navigate back to home or another screen
      >
        <Text style={styles.buttonText}>Devam Et</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});