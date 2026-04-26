import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import TarjetaAlerta from './tarjeta_alertas';

interface Alerta {
  id: string;
  mensaje: string;
  estado: string;
  hora: string;
  tipo: 'parametro' | 'sensor';
}

const ALERTAS_HOY: Alerta[] = [
  { id: '1', mensaje: 'pH en 8.7', estado: 'algo alto', hora: '14:00', tipo: 'parametro' },
  { id: '2', mensaje: 'Turbidez en 4.2', estado: 'fuera de rango', hora: '11:30', tipo: 'parametro' },
  { id: '3', mensaje: 'Sensor desconectado', estado: 'fallo', hora: '09:15', tipo: 'sensor' },
];

const ALERTAS_SEMANA: Alerta[] = [
  { id: '4', mensaje: 'pH en 8.9', estado: 'alto', hora: 'Lun 08:00', tipo: 'parametro' },
  { id: '5', mensaje: 'Temperatura en 27°C', estado: 'algo alto', hora: 'Mar 13:00', tipo: 'parametro' },
  { id: '6', mensaje: 'Señal débil', estado: 'advertencia', hora: 'Mié 17:30', tipo: 'sensor' },
  { id: '7', mensaje: 'TDS en 520 ppm', estado: 'fuera de rango', hora: 'Jue 10:00', tipo: 'parametro' },
];

interface ListaAlertasProps {
  filtro: 'hoy' | 'semanal';
}

export default function ListaAlertas({ filtro }: ListaAlertasProps) {
  const [alertasHoy, setAlertasHoy] = useState<Alerta[]>(ALERTAS_HOY);
  const [alertasSemana, setAlertasSemana] = useState<Alerta[]>(ALERTAS_SEMANA);

  const alertas = filtro === 'hoy' ? alertasHoy : alertasSemana;

  const eliminar = (id: string) => {
    if (filtro === 'hoy') {
      setAlertasHoy(prev => prev.filter(a => a.id !== id));
    } else {
      setAlertasSemana(prev => prev.filter(a => a.id !== id));
    }
  };

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
              {...alerta}
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