import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import FiltroTiempo from '../../components/ui/filto_tiempo';
import GraficaHistorial from '../../components/ui/gafico_histo';
import ResumenHistorial from '../../components/ui/ResumenHistorial';
import ModalLecturasDia from '../../components/ui/modal_lectura_dia';
import { estilos } from '../../styles/style_historial';
import { useHistorial } from '../../hooks/useHistorial';

type Periodo = 'dia' | 'mes' | 'año';
type Parametro = 'ph' | 'temperatura' | 'turbidez' | 'solido';

export default function HistorialScreen() {
  const [periodo, setPeriodo]           = useState<Periodo>('dia');
  const [parametro, setParametro]       = useState<Parametro>('ph');
  const [modalVisible, setModalVisible] = useState(false);
  const [graficaVisible, setGraficaVisible] = useState(false);

  const { promedios, datosGrafica, lecturas: lecturasDB, alertas, semaforo, diasPerfectos, diasMalos, mesesMalos, resumenTexto } = useHistorial(periodo);
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

        <ResumenHistorial
          periodo={periodo}
          diasPerfectos={diasPerfectos}
          diasMalos={diasMalos}
          mesesMalos={mesesMalos}
          totalAlertas={alertas.length}
          promedios={promedios}
          semaforo={semaforo}
          alertasRecientes={alertas}
          onVerLectura={() => setModalVisible(true)}
          onVerGrafica={() => setGraficaVisible(!graficaVisible)}
          graficaVisible={graficaVisible}
        />

        {graficaVisible && (
          <>
            <View style={estilos.espaciador} />
            <GraficaHistorial
              periodo={periodo}
              parametro={parametro}
              onParametroChange={setParametro}
              datos={datosGrafica}
            />
          </>
        )}

      </ScrollView>
      <ModalLecturasDia
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        lecturas={lecturasDB}
      />
    </View>
  );
}