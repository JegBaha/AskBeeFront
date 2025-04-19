import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation stack param list (adjust according to your app's navigation structure)
type RootStackParamList = {
  NewAccount1: undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleSignUp = () => {
        navigation.navigate('NewAccount1'); // Navigate to NewAccount1 without conditions
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={require('../../assets/images/ay1.png')} style={styles.ayImage} />
                <Image source={require('../../assets/images/dag1.png')} style={styles.dagImage} />
                <TextInput
                    style={styles.input}
                    placeholder="E-posta"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifreyi Onayla"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                </TouchableOpacity>
                <Image source={require('../../assets/images/ari2.png')} style={styles.ariImage} />
                <Text style={[styles.welcomeText, { fontFamily: 'Poppins-Regular' }]}>Hoşgeldin!</Text>
                <Text style={[styles.subText, { fontFamily: 'Poppins-Regular' }]}>Hızlıca kayıt olabilirsin minik dostum!</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#92c7f0',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 170,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    ariImage: {
        width: 175,
        height: 175,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: 50,
        marginTop: -283,
    },
    welcomeText: {
        fontSize: 35,
        color: '#333',
        position: 'absolute',
        top: -105,
        right: 200,
    },
    subText: {
        fontSize: 18,
        color: '#333',
        position: 'absolute',
        top: -40,
        right: 70,
    },
    ayImage: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: 20,
        left: 20,
    },
    dagImage: {
        width: 200,
        height: 150,
        position: 'absolute',
        bottom: -35,
        left: 0,
    },
});

export default SignUpPage;