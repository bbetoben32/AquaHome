import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Button from '../components/Button';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#1a3a5c', '#2d6a9f', '#7aa8c7']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>AQUAHOME</Text>
      </View>

      <Button
        text="Entrar"
        onPress={() => router.push('/(auth)/login')}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 100,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 4,
  },
});