import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalLecturasDiaProps {
  visible: boolean;
  onClose: () => void;
  lecturas: any[];
}

const RANGOS = {
  ph: { min: 6.5, max: 8.0 },
  ntu: { min: 0, max: 4.0 },
  temperatura: { min: 18, max: 28 },
  ppm: { min: 150, max: 500 },
};

const isOutOfRange = (value: number, min: number, max: number) =>
  value < min || value > max;

type EstadoLectura = "ok" | "warning" | "alert";

const getEstado = (lectura: any): EstadoLectura => {
  const alertas = [
    isOutOfRange(lectura.ph ?? 0, RANGOS.ph.min, RANGOS.ph.max),
    isOutOfRange(lectura.turbidity ?? 0, RANGOS.ntu.min, RANGOS.ntu.max),
    isOutOfRange(
      lectura.temperature ?? 0,
      RANGOS.temperatura.min,
      RANGOS.temperatura.max,
    ),
    isOutOfRange(lectura.tds ?? 0, RANGOS.ppm.min, RANGOS.ppm.max),
  ];
  const n = alertas.filter(Boolean).length;
  if (n >= 2) return "alert";
  if (n === 1) return "warning";
  return "ok";
};

const getFechaHoy = () => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatHora = (ts: string) => {
  const fecha = new Date(ts.endsWith("Z") ? ts : ts + "Z");
  return fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function IndicadorEstado({ estado }: { estado: EstadoLectura }) {
  const colores = { ok: "#22C55E", warning: "#daf50b", alert: "#ef2d2d" };
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

function FilaLectura({ lectura }: { lectura: any }) {
  const estado = getEstado(lectura);
  return (
    <View style={estilos.fila}>
      <View style={estilos.horaContainer}>
        <IndicadorEstado estado={estado} />
        <Text style={estilos.hora}>{formatHora(lectura.timestamp)}</Text>
      </View>
      <View style={estilos.badges}>
        <Badge
          label={`pH ${lectura.ph}`}
          isAlert={isOutOfRange(lectura.ph ?? 0, RANGOS.ph.min, RANGOS.ph.max)}
        />
        <Badge
          label={`Turbidez ${lectura.turbidity} NTU`}
          isAlert={isOutOfRange(
            lectura.turbidity ?? 0,
            RANGOS.ntu.min,
            RANGOS.ntu.max,
          )}
        />
        <Badge
          label={`Temp ${lectura.temperature}°C`}
          isAlert={isOutOfRange(
            lectura.temperature ?? 0,
            RANGOS.temperatura.min,
            RANGOS.temperatura.max,
          )}
        />
        <Badge
          label={`Sólidos ${lectura.tds} ppm`}
          isAlert={isOutOfRange(
            lectura.tds ?? 0,
            RANGOS.ppm.min,
            RANGOS.ppm.max,
          )}
        />
      </View>
    </View>
  );
}

export default function ModalLecturasDia({
  visible,
  onClose,
  lecturas,
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
            {lecturas.length === 0 ? (
              <Text
                style={{
                  color: "#94A3B8",
                  fontFamily: "Poppins_400Regular",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Sin lecturas
              </Text>
            ) : (
              [...lecturas]
                .reverse()
                .map((lectura, index) => (
                  <FilaLectura key={index} lectura={lectura} />
                ))
            )}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  closeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  contenedor: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  botonCerrar: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  headerContainer: { marginBottom: 20 },
  titulo: { fontSize: 22, fontFamily: "Poppins_600SemiBold", color: "#1F2937" },
  fecha: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    marginTop: 4,
    textTransform: "capitalize",
  },
  scrollView: { flexGrow: 0 },
  scrollContent: { paddingBottom: 10 },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  horaContainer: { flexDirection: "row", alignItems: "center", width: 75 },
  indicador: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  hora: { fontSize: 16, fontFamily: "Poppins_400Regular", color: "#6B7280" },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 },
  badge: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeAlert: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1.5,
    borderColor: "#EF5350",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#00838F",
  },
  badgeTextAlert: { color: "#D32F2F" },
});
