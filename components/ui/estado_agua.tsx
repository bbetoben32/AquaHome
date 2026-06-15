import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EstadoAguaProps {
  status?: 'APTA' | 'PRECAUCION' | 'NO APTA';
  timestamp?: string;
}

export default function EstadoAgua({ status = 'APTA', timestamp }: EstadoAguaProps) {
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

  const config = {
    APTA:      { icono: 'checkmark' as const, texto: 'Todo correcto' },
    PRECAUCION:{ icono: 'alert'     as const, texto: 'Precaución'    },
    'NO APTA': { icono: 'warning'   as const, texto: 'Alerta de calidad' },
  };

  const { icono, texto } = config[status] ?? config['APTA'];

  return (
    <View style={estilos.container}>
      <View style={estilos.iconoContainer}>
        <Ionicons name={icono} size={40} color="white" />
      </View>
      <Text style={estilos.estado}>{texto}</Text>
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