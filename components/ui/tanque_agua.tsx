import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import EstadoAgua from './estado_agua';

const TANQUE_ALTO = 260;
const TANQUE_ANCHO = 300;

interface TanqueAguaProps {
  nivel: number;
}

export default function TanqueAgua({ nivel = 70 }: TanqueAguaProps) {
  const alturaAgua = useSharedValue(0);
  const ondaX = useSharedValue(0);
  const [mostrarEstado, setMostrarEstado] = useState(false);

  const iniciarOla = () => {
    ondaX.value = 0;
    ondaX.value = withRepeat(
      withTiming(-TANQUE_ANCHO, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    setMostrarEstado(true);
  };

  useEffect(() => {
    alturaAgua.value = withTiming(
      (nivel / 100) * TANQUE_ALTO,
      { duration: 2000, easing: Easing.out(Easing.ease) },
      (finished) => {
        if (finished) runOnJS(iniciarOla)();
      }
    );
  }, [nivel]);

  const estiloAgua = useAnimatedStyle(() => ({
    height: alturaAgua.value,
  }));

  const estiloOnda = useAnimatedStyle(() => ({
    transform: [{ translateX: ondaX.value }],
  }));

  const w = TANQUE_ANCHO;
  const ola = `M0,15 Q${w * 0.25},-5 ${w * 0.5},15 Q${w * 0.75},35 ${w},15 Q${w * 1.25},-5 ${w * 1.5},15 Q${w * 1.75},35 ${w * 2},15 L${w * 2},30 L0,30 Z`;

  return (
    <View style={estilos.tanque}>
      <View style={estilos.interior}>
        <Animated.View style={[estilos.agua, estiloAgua]}>
          <Animated.View style={[estilos.ondaContainer, estiloOnda]}>
            <Svg width={TANQUE_ANCHO * 3} height={30}>
              <Path d={ola} fill="#3282B8" />
              <Path
                d={`M${w},15 Q${w * 1.25},-5 ${w * 1.5},15 Q${w * 1.75},35 ${w * 2},15 Q${w * 2.25},-5 ${w * 2.5},15 Q${w * 2.75},35 ${w * 3},15 L${w * 3},30 L${w},30 Z`}
                fill="#3282B8"
              />
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>

      {mostrarEstado && (
        <View style={estilos.overlay}>
          <EstadoAgua />
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tanque: {
    width: TANQUE_ANCHO,
    height: TANQUE_ALTO,
    borderWidth: 3,
    borderColor: '#bbbdbe8e',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  interior: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  agua: {
    width: '100%',
    backgroundColor: '#3282B8',
  },
  ondaContainer: {
    position: 'absolute',
    top: -28,
    width: TANQUE_ANCHO * 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});