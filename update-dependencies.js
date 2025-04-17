const { execSync } = require('child_process');
const fs = require('fs');

// Güncellenecek bağımlılıklar
const dependenciesToUpdate = {
  '@expo/vector-icons': '^14.0.2',
  '@react-native-async-storage/async-storage': '1.23.1',
  'expo': '~52.0.46',
  'expo-av': '~15.0.2',
  'expo-blur': '~14.0.3',
  'expo-camera': '~16.0.18',
  'expo-constants': '~17.0.8',
  'expo-document-picker': '~13.0.3',
  'expo-font': '~13.0.4',
  'expo-image-picker': '~16.0.6',
  'expo-linear-gradient': '~14.0.2',
  'expo-linking': '~7.0.5',
  'expo-router': '~4.0.20',
  'expo-speech': '~13.0.1',
  'expo-splash-screen': '~0.29.24',
  'expo-status-bar': '~2.0.1',
  'expo-updates': '~0.27.4',
  'lottie-react-native': '7.1.0',
  'react': '18.3.1',
  'react-dom': '18.3.1',
  'react-native': '0.76.9',
  'react-native-gesture-handler': '~2.20.2',
  'react-native-reanimated': '~3.16.1',
  'react-native-safe-area-context': '4.12.0',
  'react-native-screens': '~4.4.0',
  '@types/react': '~18.3.12'
};

try {
  console.log('Bağımlılıklar güncelleniyor...');

  // package.json dosyasını oku
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Bağımlılıkları güncelle
  for (const [pkg, version] of Object.entries(dependenciesToUpdate)) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      packageJson.dependencies[pkg] = version;
      console.log(`${pkg} => ${version} olarak güncellendi.`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
      packageJson.devDependencies[pkg] = version;
      console.log(`${pkg} => ${version} olarak güncellendi (devDependencies).`);
    } else {
      console.log(`${pkg} package.json'da bulunamadı, dependencies'e ekleniyor.`);
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies[pkg] = version;
    }
  }

  // Güncellenmiş package.json dosyasını yaz
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('package.json güncellendi.');

  // Bağımlılıkları yükle
  console.log('npm bağımlılıkları yükleniyor...');
  execSync('npm install', { stdio: 'inherit' });

  // Expo bağımlılıklarını kontrol et ve düzelt
  console.log('Expo bağımlılıkları kontrol ediliyor ve düzeltiliyor...');
  execSync('npx expo install --fix', { stdio: 'inherit' });

  console.log('Tüm bağımlılıklar başarıyla güncellendi ve kontrol edildi.');
} catch (error) {
  console.error('Hata oluştu:', error.message);
  process.exit(1);
}