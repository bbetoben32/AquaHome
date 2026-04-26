import { View, Text, ScrollView } from 'react-native';
import { estilos } from '../../styles/style_historial';
import PanelNotificaciones from '../../components/ui/notificaciones';

export default function NotificacionScreen() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Notificaciones</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, paddingBottom: 120,  gap: 16 }}
        style={{ width: '100%' }}
      >
        <PanelNotificaciones />
      </ScrollView>
    </View>
  );
}