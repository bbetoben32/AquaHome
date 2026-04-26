import { View, Text, StyleSheet } from 'react-native';

interface TarjetaSensorProps {
  nombre: string;
  valor: number;
  unidad: string;
  estado: string;
}

export default function TarjetaSensor({ nombre, valor, unidad, estado }: TarjetaSensorProps) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.nombre}>{nombre}</Text>
      <View style={estilos.valorContainer}>
        <Text style={estilos.valor}>{valor}</Text>
        <Text style={estilos.unidad}> {unidad}</Text>
      </View>
      <View style={estilos.estadoBadge}>
        <Text style={estilos.estadoTexto}>{estado}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    gap: 6,
  },
  nombre: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#0F4C75',
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valor: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 22,
    color: '#0F4C75',
  },
  unidad: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#0F4C75',
  },
  estadoBadge: {
    backgroundColor: 'rgba(39,174,96,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  estadoTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#27AE60',
  },
});