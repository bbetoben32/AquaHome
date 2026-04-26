import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BotonContornoProps {
  text: string;
  onPress: () => void;
}

export default function BotonContorno({ text, onPress }: BotonContornoProps) {
  return (
    <TouchableOpacity style={estilos.boton} onPress={onPress}>
      <Text style={estilos.texto}>{text}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: '85%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    
    
  },
  texto: {
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    fontSize: 30,
  },
});