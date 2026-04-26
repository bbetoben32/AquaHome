import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BotonCancelarProps {
  text: string;
  onPress: () => void;
}

export default function BotonCancelar({ text, onPress }: BotonCancelarProps) {
  return (
    <TouchableOpacity style={estilos.boton} onPress={onPress}>
      <Text style={estilos.texto}>{text}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: '100%',
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#7C94FF',
    backgroundColor: 'rgba(200,220,240,0.2)',
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: 'Poppins_400Regular',
    color: '#0C46AA',
    fontSize: 28,
  },
});