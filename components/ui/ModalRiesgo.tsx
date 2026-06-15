import { View, Text, Modal, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalRiesgoProps {
  visible: boolean;
  parametro: string | null;
  valor: number | string;
  onCerrar: () => void;
}

const NUMERO_PROFESIONAL = 'tel:+576012345678'; // Cambia por el número real

const RIESGOS: Record<string, {
  titulo: string;
  descripcion: string;
  nivelRiesgo: 'alto' | 'medio';
  colorRiesgo: string;
  pasos: string[];
  productos: string[];
}> = {
  ph_bajo: {
    titulo: 'pH Bajo (Agua Ácida)',
    descripcion: 'El agua tiene un nivel de acidez por debajo de 6.5, lo que puede corroer tuberías y generar contaminación por metales. Según la Resolución 2115 de 2007, el rango permitido es 6.5 – 9.0.',
    nivelRiesgo: 'alto',
    colorRiesgo: '#E74C3C',
    pasos: [
      'Deja de consumir el agua inmediatamente.',
      'Vacía parcialmente el depósito (al menos 1/3).',
      'Agrega bicarbonato de sodio disuelto en agua para neutralizar la acidez.',
      'Espera 2 horas y mide el pH nuevamente.',
      'Si no mejora, vacía completamente y limpia el depósito.',
      'Llena con agua nueva y verifica el pH antes de consumir.',
    ],
    productos: [
      'Bicarbonato de sodio (NaHCO₃)',
      'Cal hidratada (Ca(OH)₂) — solo en pequeñas cantidades',
      'Kit de medición de pH',
    ],
  },
  ph_alto: {
    titulo: 'pH Alto (Agua Alcalina)',
    descripcion: 'El agua tiene un nivel alcalino por encima de 9.0, lo que puede causar incrustaciones en tuberías y mal sabor. Según la Resolución 2115 de 2007, el rango permitido es 6.5 – 9.0.',
    nivelRiesgo: 'medio',
    colorRiesgo: '#F39C12',
    pasos: [
      'Suspende temporalmente el consumo del agua.',
      'Vacía parcialmente el depósito (al menos 1/3).',
      'Agrega ácido cítrico diluido en agua para reducir la alcalinidad.',
      'Mezcla bien y espera 2 horas.',
      'Mide el pH nuevamente antes de consumir.',
      'Si persiste, contacta un profesional.',
    ],
    productos: [
      'Ácido cítrico diluido',
      'Vinagre blanco (solución temporal)',
      'Kit de medición de pH',
    ],
  },
  turbidez_alta: {
    titulo: 'Turbidez Alta',
    descripcion: 'El agua presenta partículas suspendidas por encima de 2 NTU. Esto puede indicar presencia de bacterias, sedimentos o contaminantes. Según la Resolución 2115 de 2007, el máximo permitido es 2 NTU.',
    nivelRiesgo: 'alto',
    colorRiesgo: '#E74C3C',
    pasos: [
      'No consumas ni uses el agua para cocinar.',
      'Cierra el suministro del depósito.',
      'Vacía completamente el depósito.',
      'Limpia las paredes con cepillo y solución de hipoclorito.',
      'Enjuaga abundantemente con agua limpia.',
      'Aplica cloración al llenar nuevamente (ver productos).',
      'Espera 30 minutos antes de usar el agua.',
    ],
    productos: [
      'Hipoclorito de sodio al 5% (lejía/cloro doméstico)',
      'Dosis: 1 litro por cada 1.000 litros de agua',
      'Cepillo de cerdas duras para limpieza de paredes',
      'Guantes y mascarilla de protección',
    ],
  },
  temperatura_alta: {
    titulo: 'Temperatura Alta',
    descripcion: 'La temperatura del agua supera los 30°C, lo que favorece la proliferación de bacterias como Legionella y E. coli. Se recomienda mantener el agua por debajo de 25°C.',
    nivelRiesgo: 'medio',
    colorRiesgo: '#F39C12',
    pasos: [
      'Evita consumir el agua si la temperatura supera 35°C.',
      'Revisa si el depósito está expuesto directamente al sol.',
      'Instala aislamiento térmico en el tanque si es posible.',
      'Realiza una cloración preventiva del depósito.',
      'Consulta un profesional si la temperatura no baja.',
    ],
    productos: [
      'Hipoclorito de sodio al 5% (cloración preventiva)',
      'Aislante térmico para tanques (lana de vidrio o espuma)',
      'Pintura reflectante para tanques elevados',
    ],
  },
};

function getRiesgoKey(parametro: string, valor: number | string): string | null {
  const v = typeof valor === 'string' ? parseFloat(valor) : valor;
  if (isNaN(v)) return null;
  if (parametro === 'pH') {
    if (v < 6.5) return 'ph_bajo';
    if (v > 9.0) return 'ph_alto';
  }
  if (parametro === 'Turbidez' && v > 2) return 'turbidez_alta';
  if (parametro === 'Temperatura' && v > 30) return 'temperatura_alta';
  return null;
}

export default function ModalRiesgo({ visible, parametro, valor, onCerrar }: ModalRiesgoProps) {
  if (!parametro) return null;
  const key = getRiesgoKey(parametro, valor);
  if (!key) return null;
  const riesgo = RIESGOS[key];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <View style={estilos.overlay}>
        <View style={estilos.modal}>

          {/* Header */}
          <View style={[estilos.header, { backgroundColor: riesgo.colorRiesgo }]}>
            <View style={estilos.headerTextos}>
              <Text style={estilos.headerTitulo}>{riesgo.titulo}</Text>
              <View style={estilos.badgeRiesgo}>
                <Ionicons name="warning" size={12} color="white" />
                <Text style={estilos.badgeTexto}>
                  Riesgo {riesgo.nivelRiesgo === 'alto' ? 'Alto' : 'Medio'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
              <Ionicons name="close" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={estilos.cuerpo} showsVerticalScrollIndicator={false}>

            {/* Descripción */}
            <Text style={estilos.descripcion}>{riesgo.descripcion}</Text>

            {/* Pasos */}
            <Text style={estilos.seccionTitulo}>
              <Ionicons name="list" size={15} color="#0F4C75" /> Pasos a seguir
            </Text>
            {riesgo.pasos.map((paso, i) => (
              <View key={i} style={estilos.pasoFila}>
                <View style={estilos.pasoNumero}>
                  <Text style={estilos.pasoNumeroTexto}>{i + 1}</Text>
                </View>
                <Text style={estilos.pasoTexto}>{paso}</Text>
              </View>
            ))}

            {/* Productos */}
            <Text style={estilos.seccionTitulo}>
              <Ionicons name="flask" size={15} color="#0F4C75" /> Productos recomendados
            </Text>
            {riesgo.productos.map((producto, i) => (
              <View key={i} style={estilos.productoFila}>
                <Ionicons name="checkmark-circle" size={16} color="#3282B8" />
                <Text style={estilos.productoTexto}>{producto}</Text>
              </View>
            ))}

            {/* Botón profesional */}
            <TouchableOpacity
              style={estilos.botonProfesional}
              onPress={() => Linking.openURL(NUMERO_PROFESIONAL)}
            >
              <Ionicons name="call" size={18} color="white" />
              <Text style={estilos.botonProfesionalTexto}>Llamar a un profesional</Text>
            </TouchableOpacity>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTextos: {
    flex: 1,
    gap: 6,
  },
  headerTitulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: 'white',
  },
  badgeRiesgo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: 'white',
  },
  botonCerrar: {
    padding: 4,
  },
  cuerpo: {
    padding: 16,
  },
  descripcion: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  seccionTitulo: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#0F4C75',
    marginBottom: 10,
    marginTop: 4,
  },
  pasoFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  pasoNumero: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F4C75',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  pasoNumeroTexto: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    color: 'white',
  },
  pasoTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  productoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  productoTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  botonProfesional: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C75',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  botonProfesionalTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: 'white',
  },
});