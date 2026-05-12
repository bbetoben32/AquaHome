import { View, Text, StyleSheet } from 'react-native';

type Periodo = 'dia' | 'mes' | 'año';

interface PromedioDiaProps {
  periodo: Periodo;
  promedios: { ph: number; temperatura: number; turbidez: number; solido: number };
}

export default function PromedioDia({ periodo, promedios }: PromedioDiaProps) {
  const titulo = periodo === 'dia' ? 'Promedio del día' : periodo === 'mes' ? 'Promedio del mes' : 'Promedio del año';

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.valoresContainer}>
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{promedios.ph}</Text>
          <Text style={estilos.valorEtiqueta}>pH prom.</Text>
        </View>
        <View style={estilos.separador} />
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{promedios.temperatura}</Text>
          <Text style={estilos.valorEtiqueta}>Temp prom.</Text>
        </View>
        <View style={estilos.separador} />
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{promedios.turbidez}</Text>
          <Text style={estilos.valorEtiqueta}>NTU prom.</Text>
        </View>
        <View style={estilos.separador} />
        <View style={estilos.valorItem}>
          <Text style={estilos.valorNumero}>{promedios.solido}</Text>
          <Text style={estilos.valorEtiqueta}>ppm prom.</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { backgroundColor: 'white', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 20 },
  titulo: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#64748B', marginBottom: 12 },
  valoresContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  valorItem: { flex: 1, alignItems: 'center' },
  valorNumero: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, color: '#1E293B', marginBottom: 2 },
  valorEtiqueta: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8' },
  separador: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
});