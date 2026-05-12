import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import FiltroTiempo from '../../components/ui/filto_tiempo';
import GraficaHistorial from '../../components/ui/gafico_histo';
import PromedioDia from '../../components/ui/promedio_dia';
import LecturaDia from '../../components/ui/lectura_dia';
import ModalLecturasDia from '../../components/ui/modal_lectura_dia';
import { estilos } from '../../styles/style_historial';
import { useHistorial } from '../../hooks/useHistorial';
import { useReadings } from '../../hooks/useReadings';

type Periodo = 'dia' | 'mes' | 'año';
type Parametro = 'ph' | 'temperatura' | 'turbidez' | 'solido';

export default function HistorialScreen() {
  const [periodo, setPeriodo]           = useState<Periodo>('dia');
  const [parametro, setParametro]       = useState<Parametro>('ph');
  const [modalVisible, setModalVisible] = useState(false);

  const { promedios, datosGrafica, lecturas: lecturasDB } = useHistorial(periodo);
  const { lecturas: lecturasRT } = useReadings();

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Historial</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.scroll}
        style={estilos.scrollView}
      >
        <FiltroTiempo seleccionado={periodo} onChange={setPeriodo} />
        <View style={estilos.espaciador} />
        <GraficaHistorial
          periodo={periodo}
          parametro={parametro}
          onParametroChange={setParametro}
          datos={datosGrafica}
        />
        <View style={estilos.espaciador} />
        <PromedioDia periodo={periodo} promedios={promedios} />
        <View style={estilos.espaciador} />
        <View style={estilos.wrapperLectura}>
          <LecturaDia onPress={() => setModalVisible(true)} />
        </View>
      </ScrollView>
      <ModalLecturasDia
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        lecturas={lecturasDB}
      />
    </View>
  );
}