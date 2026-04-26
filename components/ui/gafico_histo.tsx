import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { 
  VictoryChart, 
  VictoryAxis, 
  VictoryArea, 
  VictoryScatter,
  VictoryBar,
  VictoryLine,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { useState } from 'react';

const { width } = Dimensions.get('window');

type Periodo = 'dia' | 'mes' | 'año';
type Parametro = 'ph' | 'temperatura' | 'turbidez' | 'solido';

interface GraficaHistorialProps {
  periodo: Periodo;
  parametro: Parametro;
  onParametroChange: (parametro: Parametro) => void;
}

interface TooltipData {
  x: string;
  y: number;
  fueraDeRango: boolean;
}

const OPCIONES_PARAMETRO: { label: string; valor: Parametro }[] = [
  { label: 'pH', valor: 'ph' },
  { label: 'Temp', valor: 'temperatura' },
  { label: 'Turb', valor: 'turbidez' },
  { label: 'Solido', valor: 'solido' },
];

const COLORES: Record<Parametro, { principal: string; claro: string }> = {
  ph: { principal: '#3B82F6', claro: '#93C5FD' },
  temperatura: { principal: '#F97316', claro: '#FDBA74' },
  turbidez: { principal: '#22C55E', claro: '#86EFAC' },
  solido: { principal: '#A855F7', claro: '#D8B4FE' },
};

const UNIDADES: Record<Parametro, string> = {
  ph: 'pH',
  temperatura: '°C',
  turbidez: 'NTU',
  solido: 'ppm',
};

const RANGOS_NORMALES: Record<Parametro, { min: number; max: number }> = {
  ph: { min: 6.5, max: 8.5 },
  temperatura: { min: 20, max: 26 },
  turbidez: { min: 0, max: 4 },
  solido: { min: 0, max: 500 },
};

const DATOS_DIA: Record<Parametro, { x: string; y: number }[]> = {
  ph: [
    { x: '08:00', y: 7.1 }, { x: '09:30', y: 7.3 }, { x: '11:00', y: 7.0 },
    { x: '12:30', y: 8.7 }, { x: '14:00', y: 7.2 }, { x: '15:30', y: 7.1 },
    { x: '17:00', y: 7.4 }, { x: '18:30', y: 7.2 },
  ],
  temperatura: [
    { x: '08:00', y: 21 }, { x: '09:30', y: 22 }, { x: '11:00', y: 23 },
    { x: '12:30', y: 25 }, { x: '14:00', y: 26 }, { x: '15:30', y: 25 },
    { x: '17:00', y: 24 }, { x: '18:30', y: 23 },
  ],
  turbidez: [
    { x: '08:00', y: 1.8 }, { x: '09:30', y: 2.0 }, { x: '11:00', y: 1.9 },
    { x: '12:30', y: 3.5 }, { x: '14:00', y: 2.1 }, { x: '15:30', y: 1.7 },
    { x: '17:00', y: 1.9 }, { x: '18:30', y: 1.8 },
  ],
  solido: [
    { x: '08:00', y: 290 }, { x: '09:30', y: 310 }, { x: '11:00', y: 305 },
    { x: '12:30', y: 380 }, { x: '14:00', y: 320 }, { x: '15:30', y: 295 },
    { x: '17:00', y: 310 }, { x: '18:30', y: 300 },
  ],
};

const DATOS_MES: Record<Parametro, { x: string; y: number }[]> = {
  ph: [
    { x: 'Sem 1', y: 7.1 }, { x: 'Sem 2', y: 7.3 }, { x: 'Sem 3', y: 7.0 }, { x: 'Sem 4', y: 7.2 },
  ],
  temperatura: [
    { x: 'Sem 1', y: 22 }, { x: 'Sem 2', y: 23 }, { x: 'Sem 3', y: 24 }, { x: 'Sem 4', y: 22 },
  ],
  turbidez: [
    { x: 'Sem 1', y: 1.9 }, { x: 'Sem 2', y: 2.1 }, { x: 'Sem 3', y: 1.8 }, { x: 'Sem 4', y: 2.0 },
  ],
  solido: [
    { x: 'Sem 1', y: 300 }, { x: 'Sem 2', y: 315 }, { x: 'Sem 3', y: 295 }, { x: 'Sem 4', y: 310 },
  ],
};

const DATOS_AÑO: Record<Parametro, { x: string; y: number }[]> = {
  ph: [
    { x: 'Ene', y: 7.1 }, { x: 'Feb', y: 7.2 }, { x: 'Mar', y: 7.0 },
    { x: 'Abr', y: 7.3 }, { x: 'May', y: 7.1 }, { x: 'Jun', y: 7.2 },
  ],
  temperatura: [
    { x: 'Ene', y: 21 }, { x: 'Feb', y: 22 }, { x: 'Mar', y: 23 },
    { x: 'Abr', y: 24 }, { x: 'May', y: 23 }, { x: 'Jun', y: 22 },
  ],
  turbidez: [
    { x: 'Ene', y: 1.8 }, { x: 'Feb', y: 2.0 }, { x: 'Mar', y: 1.9 },
    { x: 'Abr', y: 2.1 }, { x: 'May', y: 1.7 }, { x: 'Jun', y: 1.8 },
  ],
  solido: [
    { x: 'Ene', y: 290 }, { x: 'Feb', y: 305 }, { x: 'Mar', y: 310 },
    { x: 'Abr', y: 320 }, { x: 'May', y: 295 }, { x: 'Jun', y: 300 },
  ],
};

export default function GraficaHistorial({ periodo, parametro, onParametroChange }: GraficaHistorialProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const colores = COLORES[parametro];
  const rango = RANGOS_NORMALES[parametro];
  const unidad = UNIDADES[parametro];

  const datos =
    periodo === 'dia' ? DATOS_DIA[parametro] :
    periodo === 'mes' ? DATOS_MES[parametro] :
    DATOS_AÑO[parametro];

  const maxValor = Math.max(...datos.map(d => d.y));
  const minValor = Math.min(...datos.map(d => d.y));
  
  const yMin = Math.floor(minValor - (maxValor - minValor) * 0.2);
  const yMax = Math.ceil(maxValor + (maxValor - minValor) * 0.2);

  const estaFueraDeRango = (valor: number) => valor < rango.min || valor > rango.max;

  const handlePress = (datum: { x: string; y: number }) => {
    if (tooltip?.x === datum.x && tooltip?.y === datum.y) {
      setTooltip(null);
      return;
    }
    setTooltip({
      x: datum.x,
      y: datum.y,
      fueraDeRango: estaFueraDeRango(datum.y),
    });
  };

  const axisStyle = {
    axis: { stroke: 'transparent' },
    tickLabels: { 
      fontSize: 10, 
      fill: '#64748B', 
      fontFamily: 'Poppins_400Regular',
      padding: 5 
    },
    grid: { stroke: '#E2E8F0', strokeDasharray: '4,4' },
  };

  const chartWidth = width - 72;

  const renderTooltip = () => {
    if (!tooltip) return null;
    return (
      <View style={[
        estilos.tooltip,
        tooltip.fueraDeRango && estilos.tooltipAlerta,
      ]}>
        <Text style={estilos.tooltipHora}>{tooltip.x}</Text>
        <Text style={[
          estilos.tooltipValor,
          tooltip.fueraDeRango && estilos.tooltipValorAlerta,
        ]}>
          {tooltip.y} {unidad}
        </Text>
        {tooltip.fueraDeRango && (
          <Text style={estilos.tooltipMensaje}>
            Fuera del rango ({rango.min} - {rango.max})
          </Text>
        )}
      </View>
    );
  };

  const renderFiltroParametros = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.filtroContainer}
    >
      {OPCIONES_PARAMETRO.map((opcion) => {
        const activo = parametro === opcion.valor;
        return (
          <TouchableOpacity
            key={opcion.valor}
            style={[
              estilos.filtroBoton,
              activo && estilos.filtroBotonActivo,
            ]}
            onPress={() => {
              setTooltip(null);
              onParametroChange(opcion.valor);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                estilos.filtroTexto,
                activo && estilos.filtroTextoActivo,
              ]}
            >
              {opcion.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  if (periodo === 'dia') {
    return (
      <View style={estilos.container}>
        {renderFiltroParametros()}
        {renderTooltip()}
        <VictoryChart
          width={chartWidth}
          height={220}
          domainPadding={{ x: 15, y: 10 }}
          padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
          domain={{ y: [yMin, yMax] }}
          containerComponent={
            <VictoryVoronoiContainer
              onActivated={(points) => {
                if (points.length > 0) handlePress(points[0]);
              }}
            />
          }
        >
          <Defs>
            <LinearGradient id={`gradient-${parametro}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colores.principal} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={colores.principal} stopOpacity={0.05} />
            </LinearGradient>
          </Defs>

          <VictoryAxis 
            dependentAxis 
            style={{
              ...axisStyle,
              grid: { stroke: '#E2E8F0', strokeDasharray: '4,4' },
            }}
            tickCount={5}
          />

          <VictoryAxis 
            style={{
              ...axisStyle,
              grid: { stroke: 'transparent' },
            }}
            tickLabelComponent={
              <VictoryLabel angle={0} textAnchor="middle" />
            }
          />

          <VictoryArea
            data={datos}
            interpolation="monotoneX"
            style={{
              data: {
                fill: `url(#gradient-${parametro})`,
                stroke: colores.principal,
                strokeWidth: 2.5,
              },
            }}
            animate={{ duration: 400, easing: 'cubicInOut' }}
          />

          <VictoryScatter
            data={datos.filter(d => !estaFueraDeRango(d.y) && d.y !== maxValor)}
            size={5}
            style={{
              data: {
                fill: 'white',
                stroke: colores.principal,
                strokeWidth: 2,
              },
            }}
          />

          <VictoryScatter
            data={datos.filter(d => d.y === maxValor)}
            size={6}
            style={{
              data: {
                fill: estaFueraDeRango(maxValor) ? '#EF4444' : '#F97316',
                stroke: 'white',
                strokeWidth: 2,
              },
            }}
          />

          <VictoryScatter
            data={datos.filter(d => estaFueraDeRango(d.y) && d.y !== maxValor)}
            size={5}
            style={{
              data: {
                fill: '#FEF3C7',
                stroke: '#F59E0B',
                strokeWidth: 2,
              },
            }}
          />
        </VictoryChart>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      {renderFiltroParametros()}
      {renderTooltip()}
      <VictoryChart
        width={chartWidth}
        height={220}
        domainPadding={{ x: 30, y: 10 }}
        padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
        containerComponent={
          <VictoryVoronoiContainer
            onActivated={(points) => {
              if (points.length > 0) handlePress(points[0]);
            }}
          />
        }
      >
        <VictoryAxis 
          dependentAxis 
          style={{
            ...axisStyle,
            grid: { stroke: '#E2E8F0', strokeDasharray: '4,4' },
          }}
          tickCount={5}
        />

        <VictoryAxis 
          style={{
            ...axisStyle,
            grid: { stroke: 'transparent' },
          }}
        />

        <VictoryBar
          data={datos}
          cornerRadius={{ top: 6 }}
          style={{
            data: {
              fill: ({ datum }) => estaFueraDeRango(datum.y) ? '#F97316' : colores.principal,
              width: periodo === 'mes' ? 40 : 28,
            },
          }}
          animate={{ duration: 400, easing: 'cubicInOut' }}
        />
      </VictoryChart>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  filtroContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filtroBoton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filtroBotonActivo: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  filtroTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#94A3B8',
  },
  filtroTextoActivo: {
    color: '#334155',
  },
  tooltip: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tooltipAlerta: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  tooltipHora: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
    marginBottom: 2,
  },
  tooltipValor: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A5F',
  },
  tooltipValorAlerta: {
    color: '#F97316',
  },
  tooltipMensaje: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    color: '#F97316',
    marginTop: 2,
  },
});