import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import TarjetaSensor from './tarjetas_estado';

interface MenuCalidadProps {
  lectura?: any;
  estado?: any;
}

export default function MenuCalidad({ lectura, estado }: MenuCalidadProps) {
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

  const calidad = estado?.status === 'APTA'
    ? 'Buena'
    : estado?.status === 'PRECAUCION'
    ? 'Regular'
    : estado?.status === 'NO APTA'
    ? 'Mala'
    : 'Buena';

  const colorCalidad = estado?.status === 'NO APTA'
    ? '#E74C3C'
    : estado?.status === 'PRECAUCION'
    ? '#F39C12'
    : '#27AE60';

  const getEstado = (param: string, val?: number) => {
    if (val == null) return 'Sin datos';
    const rangos: Record<string, [number, number]> = {
      ph:          [6.5, 9.0],
      temperature: [0,   30],
      turbidity:   [0,   2],
      tds:         [0,   500],
    };
    const [min, max] = rangos[param];
    return val >= min && val <= max
      ? param === 'ph' ? 'Normal' : param === 'temperature' ? 'Óptima' : param === 'turbidity' ? 'Limpia' : 'Adecuado'
      : 'Fuera de rango';
  };

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.header} onPress={toggleMenu}>
        <Text style={estilos.headerNormal}>
          Calidad del agua:{' '}
          <Text style={[estilos.estado, { color: colorCalidad }]}>{calidad}</Text>
        </Text>
        <Ionicons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={28}
          color="#0F4C75"
        />
      </TouchableOpacity>
      <Animated.View style={{ height: alturaAnim, overflow: 'hidden' }}>
        <View style={estilos.grid}>
          <TarjetaSensor nombre="pH"         valor={lectura?.ph          ?? '--'} unidad="pH"  estado={getEstado('ph',          lectura?.ph)} />
          <TarjetaSensor nombre="Temperatura" valor={lectura?.temperature ?? '--'} unidad="°C"  estado={getEstado('temperature', lectura?.temperature)} />
          <TarjetaSensor nombre="Turbidez"    valor={lectura?.turbidity   ?? '--'} unidad="NTU" estado={getEstado('turbidity',   lectura?.turbidity)} />
          <TarjetaSensor nombre="Solido"      valor={lectura?.tds         ?? '--'} unidad="ppm" estado={getEstado('tds',         lectura?.tds)} />
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