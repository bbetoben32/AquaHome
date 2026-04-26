import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

export default function BotonBuscando() {
  return (
    <LinearGradient
      colors={['#032154', '#0a3a7a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={estilos.boton}
    >
      <Image
        source={require('../../assets/images/Loading_animation_blue.gif')}
        style={estilos.gif}
        contentFit="contain"
      />
      <Text style={estilos.texto}>Buscando sensor en la red</Text>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: '100%',
    borderRadius: 16,
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gif: {
    width: 100,
    height: 100,
    marginRight:-20,
    marginLeft: -40,
  },
  texto: {
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
    fontSize: 18,
  },
});