import { View, Text, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import Boton from '../../components/ui/boton';
import BotonBuscando from '../../components/ui/buscar_boton';
import BotonCancelar from '../../components/ui/boton_cancelar';
import { estilos } from '../../styles/style_vincular';
import { useEsp32Scanner } from '../../hooks/useEsp32Scanner';

export default function VincularScreen() {
  const router = useRouter();
  const { status, deviceIp, errorMessage, startScan, cancelScan } =
    useEsp32Scanner();

  const buscando = status === 'scanning';

  // ── Animación radar ──────────────────────────────────────────────
  const escala1   = useRef(new Animated.Value(1)).current;
  const escala2   = useRef(new Animated.Value(1)).current;
  const escala3   = useRef(new Animated.Value(1)).current;
  const opacidad1 = useRef(new Animated.Value(0.7)).current;
  const opacidad2 = useRef(new Animated.Value(0.7)).current;
  const opacidad3 = useRef(new Animated.Value(0.7)).current;
  const animaciones = useRef<Animated.CompositeAnimation[]>([]);

  const crearAnimacion = (
    escala: Animated.Value,
    opacidad: Animated.Value,
    delay: number
  ) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(escala, {
            toValue: 3,
            duration: 2500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacidad, {
            toValue: 0,
            duration: 2500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(escala,   { toValue: 1,   duration: 0, useNativeDriver: true }),
          Animated.timing(opacidad, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

  const animarRadar = () => {
    const a1 = crearAnimacion(escala1, opacidad1, 0);
    const a2 = crearAnimacion(escala2, opacidad2, 600);
    const a3 = crearAnimacion(escala3, opacidad3, 1200);
    animaciones.current = [a1, a2, a3];
    a1.start();
    a2.start();
    a3.start();
  };

  const detenerAnimacion = () => {
    animaciones.current.forEach((a) => a.stop());
    escala1.setValue(1);
    escala2.setValue(1);
    escala3.setValue(1);
    opacidad1.setValue(0.7);
    opacidad2.setValue(0.7);
    opacidad3.setValue(0.7);
  };

  // ── Reaccionar a cambios de status ───────────────────────────────
  useEffect(() => {
    if (status === 'scanning') {
      animarRadar();
    } else {
      detenerAnimacion();
    }

    if (status === 'found' && deviceIp) {
      setTimeout(() => router.replace('/(tabs)/dashboard'), 800);
    }
  }, [status]);

  // ── Texto dinámico según estado ──────────────────────────────────
  const getMensaje = () => {
    switch (status) {
      case 'scanning':   return 'Buscando dispositivo Aqua\nen la red...';
      case 'found':      return `¡Dispositivo encontrado!`;
      case 'not_found':  return 'No se encontró ningún\ndispositivo Aqua en la red.';
      case 'error':      return errorMessage ?? 'Ocurrió un error.';
      default:           return 'Recuerda estar conectado a la\nmisma red wi-fi que tu dispositivo';
    }
  };

  return (
    <LinearGradient
      colors={['#0F4C75', '#3282B8', '#D9D9D9']}
      style={estilos.container}
    >
      <View style={estilos.contenido}>
        <Text style={estilos.titulo}>Vincula con tu{'\n'}Aqua</Text>

        {/* ── Radar ── */}
        <View style={estilos.radarContainer}>
          <Animated.View style={{
            width: 90, height: 90, borderRadius: 999,
            backgroundColor: 'rgba(5,40,80,0.7)',
            position: 'absolute',
            transform: [{ scale: escala3 }],
            opacity: opacidad3,
          }} />
          <Animated.View style={{
            width: 90, height: 90, borderRadius: 999,
            backgroundColor: 'rgba(5,40,80,0.7)',
            position: 'absolute',
            transform: [{ scale: escala2 }],
            opacity: opacidad2,
          }} />
          <Animated.View style={{
            width: 90, height: 90, borderRadius: 999,
            backgroundColor: 'rgba(5,40,80,0.7)',
            position: 'absolute',
            transform: [{ scale: escala1 }],
            opacity: opacidad1,
          }} />
          <View style={estilos.circuloCentro}>
            {buscando && (
              <Image
                source={require('../../assets/images/Triangle_loading.gif')}
                style={estilos.gif}
                contentFit="contain"
              />
            )}
            {status === 'found' && (
              <Text style={{ fontSize: 36, color: '#fff' }}>✓</Text>
            )}
          </View>
        </View>

        {/* ── Mensaje ── */}
        <Text style={estilos.texto}>{getMensaje()}</Text>

        {/* ── Botones ── */}
        {!buscando ? (
          <Boton text="Buscar" onPress={startScan} />
        ) : (
          <View style={estilos.botonesContainer}>
            <BotonBuscando />
            <BotonCancelar text="Cancelar" onPress={cancelScan} />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}