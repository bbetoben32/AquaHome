import { View, Text, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TarjetaNotificacionesProps {
  onCambio?: (activas: boolean) => void;
}

export default function TarjetaNotificaciones({ onCambio }: TarjetaNotificacionesProps) {
  const [activas, setActivas] = useState(true);

  const handleCambio = (valor: boolean) => {
    setActivas(valor);
    onCambio?.(valor);
  };

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.izquierda}>
        <View style={estilos.icono}>
          <Ionicons name="notifications-outline" size={22} color="#1E3A5F" />
        </View>
        <View>
          <Text style={estilos.titulo}>Notificaciones</Text>
          <Text style={estilos.subtitulo}>
            {activas ? 'Activas' : 'Inactivas'}
          </Text>
        </View>
      </View>
      <Switch
        value={activas}
        onValueChange={handleCambio}
        trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
        thumbColor="white"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  izquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icono: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A5F',
  },
  subtitulo: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
  },
});