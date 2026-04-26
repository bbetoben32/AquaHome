import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface LecturaPorHora {
  hora: string;
  ph: number;
  ntu: number;
  temperatura: number;
  ppm: number;
}

interface ModalLecturasDiaProps {
  visible: boolean;
  onClose: () => void;
}

// Rangos óptimos para cada parámetro
const RANGOS = {
  ph: { min: 6.5, max: 8.0 },
  ntu: { min: 0, max: 4.0 }, // Turbidez - menor es mejor
  temperatura: { min: 18, max: 28 },
  ppm: { min: 150, max: 500 }, // Sólidos disueltos
};

// Datos simulados de lecturas del día
const lecturasMock: LecturaPorHora[] = [
  { hora: '15:00', ph: 7.2, ntu: 1.8, temperatura: 22, ppm: 300 },
  { hora: '14:00', ph: 8.1, ntu: 1.6, temperatura: 22, ppm: 300 },
  { hora: '13:00', ph: 7.2, ntu: 4.5, temperatura: 22, ppm: 300 },
  { hora: '12:00', ph: 7.2, ntu: 1.8, temperatura: 30, ppm: 300 },
  { hora: '11:00', ph: 7.2, ntu: 1.8, temperatura: 22, ppm: 300 },
  { hora: '10:00', ph: 7.2, ntu: 1.8, temperatura: 22, ppm: 600 },
  { hora: '9:00', ph: 7.2, ntu: 1.8, temperatura: 22, ppm: 300 },
  { hora: '8:00', ph: 7.2, ntu: 1.8, temperatura: 22, ppm: 300 },
];

// Funciones para determinar si un parámetro está fuera de rango
const isOutOfRange = (value: number, param: keyof typeof RANGOS): boolean => {
  const rango = RANGOS[param];
  return value < rango.min || value > rango.max;
};

// Determina el estado general de una lectura
type EstadoLectura = 'ok' | 'warning' | 'alert';
const getEstadoLectura = (lectura: LecturaPorHora): EstadoLectura => {
  const alertas = [
    isOutOfRange(lectura.ph, 'ph'),
    isOutOfRange(lectura.ntu, 'ntu'),
    isOutOfRange(lectura.temperatura, 'temperatura'),
    isOutOfRange(lectura.ppm, 'ppm'),
  ];
  
  const numAlertas = alertas.filter(Boolean).length;
  if (numAlertas >= 2) return 'alert';
  if (numAlertas === 1) return 'warning';
  return 'ok';
};


const getFechaHoy = (): string => {
  const hoy = new Date();
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return hoy.toLocaleDateString('es-ES', opciones);
};

function IndicadorEstado({ estado }: { estado: EstadoLectura }) {
  const colores = {
    ok: '#22C55E',
    warning: '#daf50b',
    alert: '#ef2d2d',
  };

  return (
    <View style={[estilos.indicador, { backgroundColor: colores[estado] }]} />
  );
}

function Badge({
  label,
  isAlert = false,
}: {
  label: string;
  isAlert?: boolean;
}) {
  return (
    <View style={[estilos.badge, isAlert && estilos.badgeAlert]}>
      <Text style={[estilos.badgeText, isAlert && estilos.badgeTextAlert]}>
        {label}
      </Text>
    </View>
  );
}

function FilaLectura({ lectura }: { lectura: LecturaPorHora }) {
  const estado = getEstadoLectura(lectura);

  return (
    <View style={estilos.fila}>
      <View style={estilos.horaContainer}>
        <IndicadorEstado estado={estado} />
        <Text style={estilos.hora}>{lectura.hora}</Text>
      </View>
      <View style={estilos.badges}>
        <Badge
          label={`pH ${lectura.ph}`}
          isAlert={isOutOfRange(lectura.ph, 'ph')}
        />
        <Badge
          label={`Turbidez ${lectura.ntu} NTU`}
          isAlert={isOutOfRange(lectura.ntu, 'ntu')}
        />
        <Badge
          label={`Temp ${lectura.temperatura}°C`}
          isAlert={isOutOfRange(lectura.temperatura, 'temperatura')}
        />
        <Badge
          label={`Sólidos ${lectura.ppm} ppm`}
          isAlert={isOutOfRange(lectura.ppm, 'ppm')}
        />
      </View>
    </View>
  );
}

export default function ModalLecturasDia({
  visible,
  onClose,
}: ModalLecturasDiaProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="dark" style={estilos.overlay}>
        <TouchableOpacity
          style={estilos.closeArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={estilos.contenedor}>
          <TouchableOpacity style={estilos.botonCerrar} onPress={onClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>

          <View style={estilos.headerContainer}>
            <Text style={estilos.titulo}>Lecturas del día</Text>
            <Text style={estilos.fecha}>{getFechaHoy()}</Text>
          </View>

          <ScrollView
            style={estilos.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.scrollContent}
          >
            {lecturasMock.map((lectura, index) => (
              <FilaLectura key={index} lectura={lectura} />
            ))}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  botonCerrar: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F2937',
  },
  fecha: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  horaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 75,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  hora: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  badge: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeAlert: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: '#EF5350',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#00838F',
  },
  badgeTextAlert: {
    color: '#D32F2F',
  },
});
