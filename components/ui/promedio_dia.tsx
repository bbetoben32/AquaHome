import { View, Text, StyleSheet } from 'react-native';

type Periodo = 'dia' | 'mes' | 'año';

interface PromedioDiaProps {
  periodo: Periodo;
}

// Datos de ejemplo - estos vendrían de tu API/base de datos
const PROMEDIOS = {
  dia: { ph: 7.1, temperatura: 22, turbidez: 1.6, solido: 300 },
  mes: { ph: 7.2, temperatura: 23, turbidez: 1.8, solido: 310 },
  año: { ph: 7.15, temperatura: 22.5, turbidez: 1.7, solido: 305 },
};

export default function PromedioDia({ periodo }: PromedioDiaProps) {
  const datos = PROMEDIOS[periodo];

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Promedio del día</Text>
      
      <View style={estilos.valoresContainer}>
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{datos.ph}</Text>
          <Text style={estilos.valorEtiqueta}>pH prom.</Text>
        </View>
        
        <View style={estilos.separador} />
        
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{datos.temperatura}°</Text>
          <Text style={estilos.valorEtiqueta}>Temp prom.</Text>
        </View>
        
        <View style={estilos.separador} />
        
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{datos.turbidez}</Text>
          <Text style={estilos.valorEtiqueta}>NTU prom.</Text>
        </View>
        
        <View style={estilos.separador} />
        
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{datos.solido}</Text>
          <Text style={estilos.valorEtiqueta}>ppm prom.</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  titulo: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  valoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valorItem: {
    flex: 1,
    alignItems: 'center',
  },
  valorNumero: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 2,
  },
  valorEtiqueta: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#94A3B8',
  },
  separador: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
});