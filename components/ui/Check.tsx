import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface CheckboxProps {
  valor: boolean;
  onChange: (valor: boolean) => void;
}

export default function Checkbox({ valor, onChange }: CheckboxProps) {
  return (
    <View style={estilos.container}>
      <TouchableOpacity
        style={[estilos.caja, valor && estilos.cajaActiva]}
        onPress={() => onChange(!valor)}
      >
        {valor && <Text style={estilos.check}>✓</Text>}
      </TouchableOpacity>

      <View style={estilos.textoContainer}>
        <Text style={estilos.texto}>Acepto los </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/terminos')}>
          <Text style={estilos.link}>Términos y condiciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  caja: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaActiva: {
    backgroundColor: 'white',
  },
  check: {
    color: '#3282B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    fontSize: 14,
  },
  link: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1e5b8c',
    fontSize: 14,
  },
});