import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import Input from '../../components/ui/input';
import Boton from '../../components/ui/boton';
import BotonContorno from '../../components/ui/boton_contorno';
import { estilos } from '../../styles/style_login';
import { iniciarSesion } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../services/api';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    try {
      await iniciarSesion(correo, contrasena);

      const { data } = await client.get('/devices/');
      if (data && data.length > 0) {
        await AsyncStorage.setItem('aqua_device_id', JSON.stringify(data[0]));
        await AsyncStorage.setItem('aqua_device_ip', data[0].location);
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/vincular');
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.detail || 'No se pudo iniciar sesión');
    }
  };

  return (
    <LinearGradient colors={['#0F4C75', '#3282B8', '#D9D9D9']} style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Bienvenido{'\n'}de nuevo</Text>
        <Text style={estilos.subtitulo}>Ingresa para ver tu sensor</Text>
        <Input label="Correo" placeholder="correo@ejemplo.com" value={correo} onChangeText={setCorreo} icon="mail-outline" keyboardType="email-address" />
        <Input label="Contraseña" placeholder="••••••••" value={contrasena} onChangeText={setContrasena} icon="lock-closed-outline" secureTextEntry />
        <TouchableOpacity>
          <Text style={estilos.olvidaste}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
        <View style={estilos.botonContainer}>
          <Boton text="Ver Estado" onPress={handleLogin} />
        </View>
        <View style={estilos.separador}>
          <View style={estilos.linea} />
          <Text style={estilos.separadorTexto}>¿No tienes cuenta?</Text>
          <View style={estilos.linea} />
        </View>
        <BotonContorno text="Registrarme" onPress={() => router.push('/(auth)/registro')} />
      </ScrollView>
    </LinearGradient>
  );
}