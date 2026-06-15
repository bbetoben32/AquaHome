import { View, Text, ScrollView } from 'react-native';
import TanqueAgua from '../../components/ui/tanque_agua';
import { estilos } from '../../styles/style_dashboard';
import MenuCalidad from '../../components/ui/menu_calidad';
import AnimatedTabBar from '../../components/ui/barra_navegacion';
import MaintenanceCard from '../../components/ui/tarjeta_mantenimiento';
import { useReadings } from '../../hooks/useReadings';
import { useMantenimiento } from '../../hooks/useMantenimiento';

export default function DashboardScreen() {
  const { ultimaLectura, estado } = useReadings();
  const { diasRestantes, totalDias, registrar } = useMantenimiento();

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>AquaHome</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 120, gap: 20 }}
      >
        <View style={{ width: '100%', zIndex: 10, alignItems: 'center' }}>
          <TanqueAgua nivel={70}
          status={estado?.status}
          timestamp={ultimaLectura?.timestamp} />
        </View>
        <View style={{ width: '100%', zIndex: 10 }}>
          <MenuCalidad lectura={ultimaLectura} estado={estado} />
        </View>
        <View style={{ width: '100%', zIndex: 10 }}>
          <MaintenanceCard
            daysRemaining={diasRestantes}
            totalDays={totalDias}
            onMaintenanceRegistered={registrar}
          />
        </View>
      </ScrollView>
      <View style={estilos.barraContainer}>
        <AnimatedTabBar />
      </View>
    </View>
  );
}