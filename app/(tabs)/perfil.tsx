import { router } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { estilos } from '../../styles/style_historial';
import TarjetaInfo from '../../components/ui/tarjeta_perfil';
import TarjetaNotificaciones from '../../components/ui/activar_notificaciones';
import BotonCancelar from '../../components/ui/boton_cancelar';

export default function PerfilScreen() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Perfil</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, gap: 24 }}
        style={{ width: '100%' }}
      >
        <TarjetaInfo
          campos={[
            { label: 'Nombre', valor: 'Nombre_completo', editable: true, keyboardType: 'default' },
            { label: 'Correo', valor: 'pepe@gmail.com', editable: true, keyboardType: 'email-address' },
            { label: 'Contraseña', valor: '123456789', editable: true, secureText: true },
          ]}
          onGuardar={(label, valor) => console.log(`${label} actualizado: ${valor}`)}
        />

        <TarjetaInfo
          campos={[
            { label: 'Sensor', valor: 'Aqua_Home', editable: false, keyboardType: 'default' },
            { label: 'Estado', valor: 'Conectado', editable: false, icono: 'wifi-outline', puntoEstado: 'conectado' },
          ]}
          onGuardar={(label, valor) => console.log(`${label} actualizado: ${valor}`)}
/>

        <TarjetaNotificaciones/>

        <View style={{ marginHorizontal: 16 }}>
          <BotonCancelar
            text="Cerrar sesión"
            onPress={() => router.replace('/login')}
          />
        </View>
      </ScrollView>
    </View>
  );
}