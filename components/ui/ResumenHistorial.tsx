import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EstadoDia = 'verde' | 'amarillo' | 'rojo' | 'vacio';

interface DiaEstado {
  dia: string;
  estado: EstadoDia;
}

interface ResumenHistorialProps {
  periodo: 'dia' | 'mes' | 'año';
  diasPerfectos: number;
  diasMalos: number;
  mesesMalos: number;
  totalAlertas: number;
  promedios: { ph: number; temperatura: number; turbidez: number; solido: number };
  semaforo: DiaEstado[];
  alertasRecientes: any[];
  onVerLectura: () => void;
  onVerGrafica: () => void;
  graficaVisible: boolean;
}

const COLORES_ESTADO = {
  verde:    { bg: '#DCFCE7', texto: '#16A34A', icono: 'checkmark' as const },
  amarillo: { bg: '#FEF9C3', texto: '#CA8A04', icono: 'alert'     as const },
  rojo:     { bg: '#FEE2E2', texto: '#DC2626', icono: 'close'     as const },
  vacio:    { bg: '#F1F5F9', texto: '#94A3B8', icono: 'remove'    as const },
};

const formatHora = (ts: string) => {
  if (!ts) return '--';
  const fecha = new Date(ts.endsWith('Z') ? ts : ts + 'Z');
  return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const getCalidadPromedio = (
  promedios: { ph: number; temperatura: number; turbidez: number; solido: number },
  periodo: string,
  diasMalos: number,
  mesesMalos: number
) => {
    if (periodo === 'dia') {
        let fuera = 0;
        if (promedios.ph < 6.5 || promedios.ph > 9.0) fuera++;
        if (promedios.temperatura < 0 || promedios.temperatura > 30) fuera++;
        if (promedios.turbidez < 0 || promedios.turbidez > 2) fuera++;
        if (promedios.solido < 0 || promedios.solido > 500) fuera++;
        if (fuera === 0) return { texto: 'Buena', color: '#16A34A', bg: '#DCFCE7' };
        if (fuera === 1) return { texto: 'Regular', color: '#CA8A04', bg: '#FEF9C3' };
        return { texto: 'Mal', color: '#DC2626', bg: '#FEE2E2' };  // 2 o más fuera
    }

  if (periodo === 'mes') {
    if (diasMalos === 0) return { texto: 'Buena', color: '#16A34A', bg: '#DCFCE7' };
    if (diasMalos <= 5) return { texto: 'Regular', color: '#CA8A04', bg: '#FEF9C3' };
    return { texto: 'Mala', color: '#DC2626', bg: '#FEE2E2' };
  }

  if (mesesMalos === 0) return { texto: 'Buena', color: '#16A34A', bg: '#DCFCE7' };
  if (mesesMalos <= 3) return { texto: 'Regular', color: '#CA8A04', bg: '#FEF9C3' };
  return { texto: 'Mala', color: '#DC2626', bg: '#FEE2E2' };
};

export default function ResumenHistorial({
  periodo,
  diasPerfectos,
  diasMalos,
  mesesMalos,
  totalAlertas,
  promedios,
  semaforo,
  alertasRecientes,
  onVerLectura,
  onVerGrafica,
  graficaVisible,
}: ResumenHistorialProps) {

  const tituloResumen = periodo === 'dia' ? 'Resumen del día' : periodo === 'mes' ? 'Resumen del mes' : 'Resumen del año';
  const calidad       = getCalidadPromedio(promedios, periodo, diasMalos, mesesMalos);
  const estadoTexto   = calidad.texto === 'Buena' ? 'Todo bien' : calidad.texto === 'Regular' ? 'Regular' : 'Mal';
  const estadoColor   = calidad.color;

  const getMensajeDia = () => {
    if (calidad.texto === 'Buena') return 'Tu agua estuvo en perfecto estado. No se detectaron anomalías.';
    if (calidad.texto === 'Regular') {
      if (totalAlertas === 1) return 'Se detectó 1 alerta. Revisa los parámetros para mantener la calidad del agua.';
      return `Se detectaron ${totalAlertas} alertas. Deberías revisar qué parámetros están causando problemas.`;
    }
    if (totalAlertas <= 6) return `Se detectaron ${totalAlertas} alertas. Es recomendable realizar una limpieza pronto.`;
    return `Se detectaron ${totalAlertas} alertas. Se recomienda mantenimiento con urgencia.`;
  };

  return (
    <View style={estilos.wrapper}>

      {/* ── Tarjeta resumen principal ── */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.resumenTitulo}>
          {tituloResumen} —{' '}
          <Text style={{ color: estadoColor }}>{estadoTexto}</Text>
        </Text>

        {periodo === 'dia' && (
          <Text style={estilos.resumenSub}>{getMensajeDia()}</Text>
        )}

        <View style={estilos.statsRow}>
          {periodo === 'dia' && (
            <>
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{diasPerfectos}/7</Text>
                <Text style={estilos.statLbl}>Días perfectos</Text>
              </View>
              <View style={estilos.statDivider} />
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{totalAlertas}</Text>
                <Text style={estilos.statLbl}>Alertas</Text>
              </View>
            </>
          )}
          {periodo === 'mes' && (
            <>
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{diasMalos}</Text>
                <Text style={estilos.statLbl}>Días con alertas</Text>
              </View>
              <View style={estilos.statDivider} />
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{totalAlertas}</Text>
                <Text style={estilos.statLbl}>Alertas del mes</Text>
              </View>
            </>
          )}
          {periodo === 'año' && (
            <>
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{mesesMalos}</Text>
                <Text style={estilos.statLbl}>Meses con alertas</Text>
              </View>
              <View style={estilos.statDivider} />
              <View style={estilos.stat}>
                <Text style={estilos.statVal}>{totalAlertas}</Text>
                <Text style={estilos.statLbl}>Alertas del año</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ── Tarjeta promedio ── */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.seccionLabel}>
          {periodo === 'dia' ? 'Calidad promedio del día' : periodo === 'mes' ? 'Calidad promedio del mes' : 'Calidad promedio del año'}
        </Text>
        <View style={estilos.statsRow}>
          <View style={estilos.stat}>
            <Text style={estilos.statVal}>{promedios.ph}</Text>
            <Text style={estilos.statLbl}>pH prom.</Text>
          </View>
          <View style={estilos.statDivider} />
          <View style={estilos.stat}>
            <Text style={estilos.statVal}>{promedios.temperatura}°</Text>
            <Text style={estilos.statLbl}>Temp prom.</Text>
          </View>
          <View style={estilos.statDivider} />
          <View style={estilos.stat}>
            <Text style={estilos.statVal}>{promedios.turbidez}</Text>
            <Text style={estilos.statLbl}>NTU prom.</Text>
          </View>
          <View style={estilos.statDivider} />
          <View style={estilos.stat}>
            <Text style={estilos.statVal}>{promedios.solido}</Text>
            <Text style={estilos.statLbl}>ppm prom.</Text>
          </View>
        </View>
      </View>

      {/* ── Semáforo semanal ── */}
      <View style={estilos.tarjeta}>
        <Text style={estilos.seccionLabel}>Día a día de esta semana</Text>
        <View style={estilos.semaforoRow}>
          {semaforo.map((item) => {
            const color = COLORES_ESTADO[item.estado];
            return (
              <View key={item.dia} style={estilos.diaContainer}>
                <View style={[estilos.diaPill, { backgroundColor: color.bg }]}>
                  <Ionicons name={color.icono} size={14} color={color.texto} />
                </View>
                <Text style={estilos.diaNombre}>{item.dia}</Text>
              </View>
            );
          })}
        </View>
        <View style={estilos.leyendaCol}>
          <View style={estilos.leyendaItem}>
            <View style={[estilos.leyendaPunto, { backgroundColor: '#16A34A' }]} />
            <Text style={estilos.leyenda}>Agua en buen estado</Text>
          </View>
          <View style={estilos.leyendaItem}>
            <View style={[estilos.leyendaPunto, { backgroundColor: '#EAB308' }]} />
            <Text style={estilos.leyenda}>Requiere atención</Text>
          </View>
          <View style={estilos.leyendaItem}>
            <View style={[estilos.leyendaPunto, { backgroundColor: '#DC2626' }]} />
            <Text style={estilos.leyenda}>Fuera de rango</Text>
          </View>
        </View>
      </View>

      {/* ── Alertas recientes ── */}
      {alertasRecientes.length > 0 && (
        <View style={estilos.tarjeta}>
          <Text style={estilos.seccionLabel}>Alertas recientes</Text>
          {alertasRecientes.slice(0, 3).map((alerta, i) => (
            <View key={alerta.id} style={[estilos.alertaItem, i < Math.min(alertasRecientes.length, 3) - 1 && estilos.alertaBorder]}>
              <View style={[estilos.alertaDot, { backgroundColor: alerta.estado === 'alto' ? '#DC2626' : '#CA8A04' }]} />
              <View style={{ flex: 1 }}>
                <Text style={estilos.alertaMensaje}>{alerta.mensaje}</Text>
                <Text style={estilos.alertaHora}>{formatHora(alerta.created_at)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Botones ── */}
      <TouchableOpacity style={estilos.botonSecundario} onPress={onVerLectura} activeOpacity={0.8}>
        <Text style={estilos.botonSecundarioTexto}>Lectura del día</Text>
        <Ionicons name="chevron-forward" size={16} color="#64748B" />
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botonSecundario} onPress={onVerGrafica} activeOpacity={0.8}>
        <Text style={estilos.botonSecundarioTexto}>
          {graficaVisible ? 'Ocultar gráfica técnica' : 'Ver gráfica técnica'}
        </Text>
        <Ionicons name={graficaVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
      </TouchableOpacity>

    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper:              { width: '100%', gap: 12 },
  tarjeta:              { backgroundColor: 'white', borderRadius: 20, padding: 16 },
  resumenTitulo:        { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#1E3A5F', marginBottom: 4 },
  resumenSub:           { fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 14 },
  promedioHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calidadBadge:         { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  calidadTexto:         { fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  statsRow:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stat:                 { flex: 1, alignItems: 'center' },
  statVal:              { fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: '#1E293B' },
  statLbl:              { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 2 },
  statDivider:          { width: 1, height: 32, backgroundColor: '#E2E8F0' },
  seccionLabel:         { fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  semaforoRow:          { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  diaContainer:         { alignItems: 'center', gap: 4 },
  diaPill:              { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  diaNombre:            { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#64748B' },
  leyenda:              { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#94A3B8', textAlign: 'center', marginTop: 4 },
  alertaItem:           { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  alertaBorder:         { borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
  alertaDot:            { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  alertaMensaje:        { fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#1E3A5F' },
  alertaHora:           { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8', marginTop: 2 },
  botonSecundario:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 50, paddingVertical: 13, paddingHorizontal: 22, borderWidth: 1.5, borderColor: '#E2E8F0' },
  botonSecundarioTexto: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#1E293B' },
  leyendaCol:   { flexDirection: 'column', gap: 6, marginTop: 8 },
  leyendaItem:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leyendaPunto: { width: 9, height: 9, borderRadius: 5 },
  leyenda:      { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#64748B' },
});