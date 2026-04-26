import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import TarjetaSensor from './tarjetas_estado';

export default function MenuCalidad() {
  const [abierto, setAbierto] = useState(false);
  const alturaAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(alturaAnim, {
      toValue: abierto ? 0 : 280,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setAbierto(!abierto);
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.header} onPress={toggleMenu}>
        <Text style={estilos.headerNormal}>
          Calidad del agua:{' '}
          <Text style={estilos.estado}>Buena</Text>
        </Text>
        <Ionicons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={28}
          color="#0F4C75"
        />
      </TouchableOpacity>

      <Animated.View style={{ height: alturaAnim, overflow: 'hidden' }}>
        <View style={estilos.grid}>
          <TarjetaSensor nombre="pH" valor={7.2} unidad="ph" estado="Normal" />
          <TarjetaSensor nombre="Temperatura" valor={22.4} unidad="°C" estado="Óptima" />
          <TarjetaSensor nombre="Turbidez" valor={1.8} unidad="NTU" estado="Limpia" />
          <TarjetaSensor nombre="Solido" valor={300} unidad="ppm" estado="Adecuado" />
        </View>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      width: '100%',
  },
  headerNormal: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 20,
      color: '#0F4C75',
  },
  estado: {
    fontFamily: 'Poppins_700Bold',
    color: '#27AE60',
  },
  contenido: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
    paddingHorizontal: 12,
  },
});