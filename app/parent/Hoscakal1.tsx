import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Hoscakal1 = () => {
    return (
        <View style={styles.container}>
            <View style={styles.messageBox}>
                <Image source={require('../../assets/images/ari2.png')} style={styles.image} />
                <Text style={styles.messageText}>Görüşmeden ayrıldın, tekrar görüşmek üzere</Text>
                <Text style={styles.subText}>Arkadaşım senin için faydalı mıydı?</Text>
            </View>

            <View style={styles.questionBox}>
                <Text style={styles.questionText}>Bu görüşmeyi faydalı buldun mu?</Text>

                <View style={styles.iconRow}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="happy-outline" size={80} color="green" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="sad-outline" size={80} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Hoscakal1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 60,
    },
    messageBox: {
        backgroundColor: '#92c7f0',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        marginTop: 100,
        height: 263,
    },
    image: {
        width: 125,
        height: 125,
        marginBottom: 20, // Mesajdan önce biraz boşluk bırakmak için
    },
    messageText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000',
    },
    questionBox: {
        marginTop: 40,
        alignItems: 'center',
    },
    questionText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
    },
    iconButton: {
        padding: 10,
    },
});
