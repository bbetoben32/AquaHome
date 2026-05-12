import { View, Text, StyleSheet } from 'react-native';
import TarjetaAlerta from './tarjeta_alertas';
import { useAlertas } from '../../hooks/useAlertas';

interface ListaAlertasProps {
  filtro: 'hoy' | 'semanal';
}

const formatHora = (ts: string) => {
  if (!ts) return '--';  // ← agrega esto
  const fecha = new Date(ts.endsWith('Z') ? ts : ts + 'Z');
  return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export default function ListaAlertas({ filtro }: ListaAlertasProps) {
  const { alertas, loading, eliminar } = useAlertas(filtro);

  if (loading) {
    return (
      <View style={estilos.vacio}>
        <Text style={estilos.vacioTexto}>Cargando...</Text>
      </View>
    );
  }

  if (alertas.length === 0) {
    return (
      <View style={estilos.vacio}>
        <Text style={estilos.vacioTexto}>Sin alertas</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.lista}>
        {alertas.map((alerta, index) => (
          <View key={alerta.id}>
            <TarjetaAlerta
              id={String(alerta.id)}
              mensaje={alerta.mensaje}
              estado={alerta.estado}
              hora={formatHora(alerta.created_at)}
              tipo={alerta.tipo}
              onEliminar={eliminar}
            />
            {index < alertas.length - 1 && <View style={estilos.separador} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
  },
  lista: {
    gap: 4,
  },
  separador: {
    height: 0.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  vacio: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  vacioTexto: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
  },
});