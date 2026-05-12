import { View, Text, StyleSheet } from 'react-native';

interface TarjetaSensorProps {
  nombre: string;
  valor: number | string;
  unidad: string;
  estado: string;
}

const getColorEstado = (estado: string) => {
  switch (estado) {
    case 'Normal':
    case 'Óptima':
    case 'Limpia':
    case 'Adecuado':
      return { bg: 'rgba(39,174,96,0.15)', text: '#27AE60' };
    case 'Fuera de rango':
    case 'Turbia':
    case 'Elevado':
      return { bg: 'rgba(231,76,60,0.15)', text: '#E74C3C' };
    default:
      return { bg: 'rgba(149,165,166,0.15)', text: '#95A5A6' };
  }
};

export default function TarjetaSensor({ nombre, valor, unidad, estado }: TarjetaSensorProps) {
  const colores = getColorEstado(estado);

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.nombre}>{nombre}</Text>
      <View style={estilos.valorContainer}>
        <Text style={estilos.valor}>{valor}</Text>
        <Text style={estilos.unidad}> {unidad}</Text>
      </View>
      <View style={[estilos.estadoBadge, { backgroundColor: colores.bg }]}>
        <Text style={[estilos.estadoTexto, { color: colores.text }]}>{estado}</Text>
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
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  estadoTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
});