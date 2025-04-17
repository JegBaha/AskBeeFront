import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

const animals = [
  { name: 'Tavşan', image: require('/assets/rabbit.png'), backgroundColor: '#FF6B6B' },
  { name: 'Arı', image: require('/assets/bee.png'), backgroundColor: '#FFD93D' },
  { name: 'Kedi', image: require('/assets/laughing.png'), backgroundColor: '#4A90E2' },
  { name: 'Kurbağa', image: require('/assets/turtle.png'), backgroundColor: '#6BCB77' },
];

export default function CharacterSelection() {
  const router = useRouter();

  const handleSelectAnimal = (animal: { name: string; image: any }) => {
    router.push({
      pathname: '/chat',
      params: { animalName: animal.name, animalImage: JSON.stringify(animal.image) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lütfen Konuşmak İstediğin Hayvanı Seç</Text>
      <View style={styles.animalContainer}>
        {animals.map((animal, index) => (
          <Pressable
            key={index}
            style={[styles.animalButton, { backgroundColor: animal.backgroundColor }]}
            onPress={() => handleSelectAnimal(animal)}
          >
            <Image source={animal.image} style={styles.animalImage} />
          </Pressable>
        ))}
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 40,
    textAlign: 'center',
  },
  animalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  animalButton: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});