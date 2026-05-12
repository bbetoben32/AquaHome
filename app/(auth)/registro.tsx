import { View, Text, Animated, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import Input from '../../components/ui/input';
import Boton from '../../components/ui/boton';
import BotonContorno from '../../components/ui/boton_contorno';
import Checkbox from '../../components/ui/Check';
import { estilos } from '../../styles/style_registro';
import { crearCuenta, iniciarSesion } from '../../services/authService';
import { Ionicons } from '@expo/vector-icons';

const requisitos = [
  { label: 'Mínimo 6 caracteres',         test: (p: string) => p.length >= 6 },
  { label: 'Al menos una mayúscula',       test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Al menos un número',           test: (p: string) => /[0-9]/.test(p) },
  { label: 'Carácter especial (!@#$%^&*)', test: (p: string) => /[!@#$%^&*]/.test(p) },
];

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);
  const botonOpacity = useRef(new Animated.Value(0)).current;
  const botonAltura = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(botonOpacity, { toValue: aceptoTerminos ? 1 : 0, duration: 400, useNativeDriver: false }),
      Animated.timing(botonAltura, { toValue: aceptoTerminos ? 80 : 0, duration: 400, useNativeDriver: false }),
    ]).start();
  }, [aceptoTerminos]);

  const validarContrasena = (pass: string) => {
    if (pass.length < 6) return false;
    if (!/[A-Z]/.test(pass)) return false;
    if (!/[0-9]/.test(pass)) return false;
    if (!/[!@#$%^&*]/.test(pass)) return false;
    return true;
  };

const handleRegistro = async () => {
  if (!nombre || !correo || !contrasena || !confirmarContrasena) {
    Alert.alert('Error', 'Completa todos los campos');
    return;
  }
  if (contrasena !== confirmarContrasena) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }
  if (!validarContrasena(contrasena)) {
    Alert.alert('Error', 'La contraseña no cumple con los parámetros requeridos');
    return;
  }

  // Paso 1: crear cuenta
  try {
    await crearCuenta(nombre, correo, contrasena);
    console.log('Cuenta creada');
  } catch (e: any) {
    console.log('Error creando cuenta:', e.response?.data);
    Alert.alert('Error', e.response?.data?.detail || 'No se pudo crear la cuenta');
    return;
  }

  // Paso 2: iniciar sesión
  try {
    await iniciarSesion(correo, contrasena);
    console.log('Sesión iniciada');
  } catch (e: any) {
    console.log('Error iniciando sesión:', e.response?.data);
    Alert.alert('Error', 'Cuenta creada pero no se pudo iniciar sesión');
    return;
  }

  Alert.alert('¡Listo!', 'Cuenta creada', [
    { text: 'OK', onPress: () => router.push('/(auth)/vincular') }
  ]);
};

  return (
    <LinearGradient colors={['#0F4C75', '#3282B8', '#D9D9D9']} style={estilos.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo}>Bienvenido</Text>

        <Input label="Nombre" placeholder="Tu nombre" value={nombre} onChangeText={setNombre} icon="person-outline" />
        <Input label="Correo" placeholder="correo@ejemplo.com" value={correo} onChangeText={setCorreo} icon="mail-outline" keyboardType="email-address" />
        <Input
          label="Contraseña"
          placeholder="••••••••"
          value={contrasena}
          onChangeText={(text) => {
            setContrasena(text);
            setMostrarRequisitos(text.length > 0);
          }}
          icon="lock-closed-outline"
          secureTextEntry
        />

        {mostrarRequisitos && !validarContrasena(contrasena) && (
          <View style={estilos.reqContainer}>
            {requisitos.map((req, i) => {
              const cumple = req.test(contrasena);
              return (
                <View key={i} style={estilos.reqFila}>
                  <View style={[estilos.iconoCirculo, { backgroundColor: cumple ? '#4CAF50' : 'rgba(255,255,255,0.15)' }]}>
                    <Ionicons name={cumple ? 'checkmark' : 'close'} size={11} color="white" />
                  </View>
                  <Text style={[estilos.reqTexto, { color: cumple ? '#4CAF50' : 'rgba(255,255,255,0.7)' }]}>
                    {req.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Input
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
          icon="lock-closed-outline"
          secureTextEntry
        />

        {confirmarContrasena.length > 0 && (
          <View style={estilos.coincidenciaFila}>
            <Ionicons
              name={contrasena === confirmarContrasena ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={contrasena === confirmarContrasena ? '#4CAF50' : '#FF5252'}
            />
            <Text style={[estilos.coincidenciaTexto, { color: contrasena === confirmarContrasena ? '#4CAF50' : '#FF5252' }]}>
              {contrasena === confirmarContrasena ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
            </Text>
          </View>
        )}

        <Checkbox valor={aceptoTerminos} onChange={setAceptoTerminos} />
        <Animated.View style={{ opacity: botonOpacity, height: botonAltura, overflow: 'hidden', marginBottom: 8 }}>
          <Boton text="Vincular Aqua" onPress={handleRegistro} />
        </Animated.View>
        <View style={estilos.separador}>
          <View style={estilos.linea} />
          <Text style={estilos.separadorTexto}>¿Ya tienes cuenta?</Text>
          <View style={estilos.linea} />
        </View>
        <BotonContorno text="Iniciar Sesión" onPress={() => router.push('/(auth)/login')} />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}