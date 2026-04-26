import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LecturaDiaProps {
  onPress: () => void;
}

export default function LecturaDia({ onPress }: LecturaDiaProps) {
  return (
    <TouchableOpacity
      style={estilos.boton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={estilos.texto}>Lectura del día</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
    boton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        paddingVertical: 13,
        paddingHorizontal: 22,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        alignSelf: 'center', 
        gap: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
  texto: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    letterSpacing: 0.1,
  },
});