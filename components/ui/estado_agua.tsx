import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EstadoAgua() {
  return (
    <View style={estilos.container}>
      <View style={estilos.iconoContainer}>
        <Ionicons name="checkmark" size={40} color="white" />
      </View>
      <Text style={estilos.estado}>Todo correcto</Text>
      <View style={estilos.lectura}>
        <Text style={estilos.lecturaTexto}>Ultima lectura: hace 11 seg</Text>
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