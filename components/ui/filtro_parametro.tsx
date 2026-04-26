import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Parametro = 'ph' | 'temperatura' | 'turbidez' | 'solido';

interface FiltroParametroProps {
  seleccionado: Parametro;
  onChange: (parametro: Parametro) => void;
}

export default function FiltroParametro({ seleccionado, onChange }: FiltroParametroProps) {
  const opciones: { label: string; valor: Parametro }[] = [
    { label: 'pH', valor: 'ph' },
    { label: 'Temp', valor: 'temperatura' },
    { label: 'Turb', valor: 'turbidez' },
    { label: 'Solido', valor: 'solido' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.container}
    >
      {opciones.map((opcion) => {
        const activo = seleccionado === opcion.valor;
        return (
          <TouchableOpacity
            key={opcion.valor}
            style={[
              estilos.boton,
              activo && estilos.botonActivo,
            ]}
            onPress={() => onChange(opcion.valor)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                estilos.texto,
                activo && estilos.textoActivo,
              ]}
            >
              {opcion.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  boton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  botonActivo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  texto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#64748B',
  },
  textoActivo: {
    color: '#1E293B',
  },
});