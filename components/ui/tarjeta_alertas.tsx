import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';

interface AlertaProps {
  id: string;
  mensaje: string;
  estado: string;
  hora: string;
  tipo: 'parametro' | 'sensor';
  onEliminar: (id: string) => void;
}

export default function TarjetaAlerta({ id, mensaje, estado, hora, tipo, onEliminar }: AlertaProps) {
  const translateX = useSharedValue(0);

  const eliminar = () => onEliminar(id);

  const gesto = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        translateX.value = withTiming(-500, { duration: 250 }, () => {
          runOnJS(eliminar)();
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fondoStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  return (
    <View style={estilos.wrapper}>
      <Reanimated.View style={[estilos.fondo, fondoStyle]}>
        <Ionicons name="trash-outline" size={22} color="white" />
      </Reanimated.View>

      <GestureDetector gesture={gesto}>
        <Reanimated.View style={[estilos.tarjeta, animStyle]}>
          <View style={[estilos.icono, { backgroundColor: tipo === 'sensor' ? '#FEF3C7' : '#FEE2E2' }]}>
            <Ionicons
              name={tipo === 'sensor' ? 'warning-outline' : 'alert-circle-outline'}
              size={22}
              color={tipo === 'sensor' ? '#F59E0B' : '#EF4444'}
            />
          </View>
          <View style={estilos.contenido}>
            <View style={estilos.fila}>
              <Text style={estilos.mensaje}>{mensaje}</Text>
              <Text style={[estilos.estado, { color: tipo === 'sensor' ? '#F59E0B' : '#EF4444' }]}>
                {estado}
              </Text>
            </View>
            <Text style={estilos.hora}>{hora}</Text>
          </View>
        </Reanimated.View>
      </GestureDetector>
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  fondo: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 14,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  tarjeta: {
    backgroundColor: 'white',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  icono: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  mensaje: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A5F',
  },
  estado: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  hora: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
});