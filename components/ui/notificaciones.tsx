import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import ListaAlertas from './lista_alerta';

export default function PanelNotificaciones() {
  const [filtro, setFiltro] = useState<'hoy' | 'semanal'>('hoy');

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.filtros}>
        <TouchableOpacity
          style={[estilos.botonFiltro, filtro === 'hoy' && estilos.botonActivo]}
          onPress={() => setFiltro('hoy')}
          activeOpacity={0.8}
        >
          <Text style={[estilos.botonTexto, filtro === 'hoy' && estilos.botonTextoActivo]}>
            Hoy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botonFiltro, filtro === 'semanal' && estilos.botonActivo]}
          onPress={() => setFiltro('semanal')}
          activeOpacity={0.8}
        >
          <Text style={[estilos.botonTexto, filtro === 'semanal' && estilos.botonTextoActivo]}>
            Semanal
          </Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.separadorFiltro} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 4, paddingBottom: 4 }}
        style={estilos.scroll}
        nestedScrollEnabled
      >
        <ListaAlertas filtro={filtro} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    gap: 8,
    flex: 1,
  },
  filtros: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
  },
  botonFiltro: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonActivo: {
    backgroundColor: 'white',
  },
  botonTexto: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#94A3B8',
  },
  botonTextoActivo: {
    color: '#1E3A5F',
  },
  separadorFiltro: {
    height: 0.5,
    backgroundColor: '#E2E8F0',
  },
  scroll: {
    flex: 1,
  },
});