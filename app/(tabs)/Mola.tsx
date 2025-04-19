import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Mola = () => {
    return (
        <View style={styles.container}>
            {/* Sağ üstteki arı resmi */}
            <Image source={require('../../assets/images/ari3.png')} style={styles.image} />
            <Image source={require('../../assets/images/Cloud.png')} style={styles.cloudImage} />
            <Image source={require('../../assets/images/Cloud.png')} style={styles.cloudImage2} />
            <View style={styles.bubble}>
                <Text style={styles.bubbleText}>MOLA ZAMANI :( </Text>
            </View>

            {/* Mesaj kutusu */}
            <View style={styles.messageBox}>
                <Text style={styles.messageText}>Birlikte Çok Güzel Vakit Geçirdik!</Text>
                <Text style={styles.subText}>Birlikte oldukça vakit geçirdik!

                    Artık ailenle veya oyuncaklarınla vakit geçirebiirsin! Moladan sonra görüşmek üzere!</Text>
            </View>

        </View>
    );
};

export default Mola;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#92c7f0', // Arka plan rengi mavi
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubble: {
        position: 'absolute',
        top: 600,
        left: 120,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderColor: '#000',
        borderWidth: 1,
        elevation: 5,
        zIndex: 2,
    },
    bubbleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },

    image: {
        position: 'absolute',
        top: 200, // Sağ üst köşeye yakın konum
        right: 50,
        width: 142,  // Resmin boyutu
        height: 142, // Resmin boyutu
    },
    messageBox: {
        position: 'absolute',
        bottom: 320, // Mesajın alt kısmı
        width: '80%',
        backgroundColor: '#FFFFFF', // Beyaz kutu
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 5,
    },
    cloudImage: {
        position: 'absolute',
        top: 165,
        left: 0,
        width: 170,
        height: 140,
        resizeMode: 'contain',
        opacity: 0.8,
    },
    cloudImage2: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 170,
        height: 140,
        resizeMode: 'contain',
        opacity: 0.8,
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
});
