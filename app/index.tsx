import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import Button from '../components/ui/boton';
import { estilos } from '../styles/style_index';

export default function WelcomeScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoPosition = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoPosition, {
        toValue: -120,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#0F4C75', '#3282B8', '#D9D9D9']}
      style={estilos.container}
    >
      <Animated.View
        style={[
          estilos.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoPosition }],
          },
        ]}
      >
        <Image
          source={require('../assets/images/logo1.png')}
          style={estilos.logo}
          resizeMode="contain"
        />
        <Text style={estilos.title}>AQUAHOME</Text>
      </Animated.View>

      <Animated.View style={[estilos.buttonContainer, { opacity: buttonOpacity }]}>
        <Button
          text="Entrar"
          onPress={() => router.push('../(auth)/registro')}
        />
      </Animated.View>
    </LinearGradient>
  );
}

