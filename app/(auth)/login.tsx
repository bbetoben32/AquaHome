import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import Input from '../../components/ui/input';
import Boton from '../../components/ui/boton';
import BotonContorno from '../../components/ui/boton_contorno';
import { estilos } from '../../styles/style_login';

export default function LoginScreen() {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');

  return (
    <LinearGradient
      colors={['#0F4C75', '#3282B8', '#D9D9D9']}
      style={estilos.container}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.titulo}>Bienvenido{'\n'}de nuevo</Text>
        <Text style={estilos.subtitulo}>Ingresa para ver tu sensor</Text>

        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          icon="person-outline"
        />

        <Input
          label="Contraseña"
          placeholder="••••••••"
          value={contrasena}
          onChangeText={setContrasena}
          icon="lock-closed-outline"
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={estilos.olvidaste}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        <View style={estilos.botonContainer}>
          <Boton
            text="Ver Estado"
            onPress={() => router.push('../(tabs)/dashboard')}
          />
        </View>

        <View style={estilos.separador}>
          <View style={estilos.linea} />
          <Text style={estilos.separadorTexto}>¿No tienes cuenta?</Text>
          <View style={estilos.linea} />
        </View>

        <BotonContorno
          text="Registrarme"
          onPress={() => router.push('/(auth)/registro')}
        />

      </ScrollView>
    </LinearGradient>
  );
}