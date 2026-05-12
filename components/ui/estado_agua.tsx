import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EstadoAguaProps {
  apta?: boolean;
  timestamp?: string;
}

export default function EstadoAgua({ apta = true, timestamp }: EstadoAguaProps) {
  const formatearHora = (ts?: string) => {
    if (!ts) return '--';
    const fecha = new Date(ts.endsWith('Z') ? ts : ts + 'Z');
    return fecha.toLocaleTimeString('es-CO', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.iconoContainer}>
        <Ionicons
          name={apta ? 'checkmark' : 'warning'}
          size={40}
          color="white"
        />
      </View>
      <Text style={estilos.estado}>
        {apta ? 'Todo correcto' : 'Alerta de calidad'}
      </Text>
      <View style={estilos.lectura}>
        <Text style={estilos.lecturaTexto}>
          Ultima lectura: {formatearHora(timestamp)}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estado: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: 'white',
  },
  lectura: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lecturaTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: 'white',
  },
});