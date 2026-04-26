import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

type Periodo = 'dia' | 'mes' | 'año';

interface FiltroTiempoProps {
  seleccionado: Periodo;
  onChange: (periodo: Periodo) => void;
}

export default function FiltroTiempo({ seleccionado, onChange }: FiltroTiempoProps) {
  const [abierto, setAbierto] = useState(false);
  const alturaAnim = useRef(new Animated.Value(0)).current;

  const opciones: { label: string; valor: Periodo }[] = [
    { label: 'Día', valor: 'dia' },
    { label: 'Mes', valor: 'mes' },
    { label: 'Año', valor: 'año' },
  ];

  const etiqueta = opciones.find((o) => o.valor === seleccionado)?.label ?? 'Día';

  const toggleMenu = () => {
    Animated.timing(alturaAnim, {
      toValue: abierto ? 0 : opciones.length * 40,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setAbierto(!abierto);
  };

  const seleccionar = (valor: Periodo) => {
    onChange(valor);
    Animated.timing(alturaAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    setAbierto(false);
  };

  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>Filtrar por</Text>
      <View style={estilos.ancla}>
        <View style={[estilos.contenedor, abierto && estilos.contenedorAbierto]}>
          <TouchableOpacity style={estilos.selector} onPress={toggleMenu} activeOpacity={0.7}>
            <Text style={estilos.selectorTexto}>{etiqueta}</Text>
            <Ionicons name={abierto ? 'chevron-up' : 'chevron-down'} size={14} color="#1E293B" />
          </TouchableOpacity>
          <Animated.View style={{ height: alturaAnim, overflow: 'hidden' }}>
            {opciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.valor}
                style={[estilos.opcion, seleccionado === opcion.valor && estilos.opcionActiva]}
                onPress={() => seleccionar(opcion.valor)}
                activeOpacity={0.6}
              >
                <Text style={[estilos.opcionTexto, seleccionado === opcion.valor && estilos.opcionTextoActivo]}>
                  {opcion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 12,
    zIndex: 999,
  },
  etiqueta: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 9,
  },
  ancla: {
    height: 36,
    minWidth: 90,
    zIndex: 999,
  },
  contenedor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    zIndex: 999,
    elevation: 999,
  },
  contenedorAbierto: {
    borderRadius: 12,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectorTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1E293B',
  },
  opcion: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  opcionActiva: {
    backgroundColor: '#F1F5F9',
  },
  opcionTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#374151',
  },
  opcionTextoActivo: {
    color: '#1E293B',
    fontFamily: 'Poppins_600SemiBold',
  },
});