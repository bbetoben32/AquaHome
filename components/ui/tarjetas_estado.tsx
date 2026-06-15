import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import ModalRiesgo from './ModalRiesgo';

interface TarjetaSensorProps {
  nombre: string;
  valor: number | string;
  unidad: string;
  estado: string;
}

const getColorEstado = (estado: string) => {
  switch (estado) {
    case 'Normal':
    case 'Óptima':
    case 'Limpia':
    case 'Adecuado':
      return { bg: 'rgba(39,174,96,0.15)', text: '#27AE60' };
    case 'Fuera de rango':
    case 'Turbia':
    case 'Elevado':
      return { bg: 'rgba(231,76,60,0.15)', text: '#E74C3C' };
    default:
      return { bg: 'rgba(149,165,166,0.15)', text: '#95A5A6' };
  }
};

const esFueraDeRango = (estado: string) =>
  ['Fuera de rango', 'Turbia', 'Elevado'].includes(estado);

export default function TarjetaSensor({ nombre, valor, unidad, estado }: TarjetaSensorProps) {
  const colores = getColorEstado(estado);
  const [modalVisible, setModalVisible] = useState(false);
  const fueraDeRango = esFueraDeRango(estado);

  return (
    <>
      <View style={estilos.tarjeta}>
        {/* Header con nombre e ícono de alerta */}
        <View style={estilos.nombreFila}>
          <Text style={estilos.nombre}>{nombre}</Text>
          {fueraDeRango && (
            <TouchableOpacity onPress={() => setModalVisible(true)} style={estilos.alertaBoton}>
              <Ionicons name="warning" size={16} color="#E74C3C" />
            </TouchableOpacity>
          )}
        </View>

        <View style={estilos.valorContainer}>
          <Text style={estilos.valor}>{valor}</Text>
          <Text style={estilos.unidad}> {unidad}</Text>
        </View>

        <View style={[estilos.estadoBadge, { backgroundColor: colores.bg }]}>
          <Text style={[estilos.estadoTexto, { color: colores.text }]}>{estado}</Text>
        </View>
      </View>

      {/* Modal de gestión de riesgo */}
      <ModalRiesgo
        visible={modalVisible}
        parametro={nombre}
        valor={valor}
        onCerrar={() => setModalVisible(false)}
      />
    </>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    gap: 6,
  },
  nombreFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nombre: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#0F4C75',
  },
  alertaBoton: {
    padding: 2,
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valor: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 22,
    color: '#0F4C75',
  },
  unidad: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#0F4C75',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  estadoTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
});