import { View, Text, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import Input from '../../components/ui/input';
import Boton from '../../components/ui/boton';
import BotonContorno from '../../components/ui/boton_contorno';
import Checkbox from '../../components/ui/Check';
import { estilos } from '../../styles/style_registro';

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const botonOpacity = useRef(new Animated.Value(0)).current;
  const botonAltura = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(botonOpacity, {
        toValue: aceptoTerminos ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(botonAltura, {
        toValue: aceptoTerminos ? 80 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [aceptoTerminos]);

  return (
    <LinearGradient
      colors={['#0F4C75', '#3282B8', '#D9D9D9']}
      style={estilos.container}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.titulo}>Bienvenido</Text>

        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          icon="person-outline"
        />

        <Input
          label="Correo"
          placeholder="correo@ejemplo.com"
          value={correo}
          onChangeText={setCorreo}
          icon="mail-outline"
          keyboardType="email-address"
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
          value={contrasena}
          onChangeText={setContrasena}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <Input
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <Checkbox
          valor={aceptoTerminos}
          onChange={setAceptoTerminos}
        />

        <Animated.View style={{ opacity: botonOpacity, height: botonAltura, overflow: 'hidden', marginBottom: 8 }}>
          <Boton
            text="Vincular Aqua"
            onPress={() => router.push('/(auth)/vincular')}
          />
        </Animated.View>

        <View style={estilos.separador}>
          <View style={estilos.linea} />
          <Text style={estilos.separadorTexto}>¿Ya tienes cuenta?</Text>
          <View style={estilos.linea} />
        </View>

        <BotonContorno
          text="Iniciar Sesión"
          onPress={() => router.push('/(auth)/login')}
        />

      </ScrollView>
    </LinearGradient>
  );
}