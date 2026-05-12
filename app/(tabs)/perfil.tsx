import { router } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { estilos } from '../../styles/style_historial';
import TarjetaInfo from '../../components/ui/tarjeta_perfil';
import TarjetaNotificaciones from '../../components/ui/activar_notificaciones';
import BotonCancelar from '../../components/ui/boton_cancelar';
import { usePerfil } from '../../hooks/usePerfil';
import { cerrarSesion, actualizarNombre } from '../../services/authService';

export default function PerfilScreen() {
  const { loading, nombre, correo, dispositivo, conectado } = usePerfil();
  console.log('render perfil, conectado:', conectado);

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    router.replace('/(auth)/login');
  };

  const handleGuardar = async (label: string, valor: string) => {
    if (label === 'Nombre') {
      try {
        await actualizarNombre(valor);
        console.log('Nombre actualizado');
      } catch (e) {
        console.log('Error actualizando nombre:', e);
      }
    }
  };

  if (loading) {
    return (
      <View style={[estilos.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0F4C75" />
      </View>
    );
  }

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
            { label: 'Nombre', valor: nombre, editable: true, keyboardType: 'default' },
            { label: 'Correo', valor: correo, editable: false, keyboardType: 'email-address' },
            { label: 'Contraseña', valor: '••••••••', editable: false, secureText: true },
          ]}
          onGuardar={handleGuardar}
        />
        <TarjetaInfo
          campos={[
            { label: 'Sensor', valor: dispositivo?.name ?? 'Sin dispositivo', editable: false, keyboardType: 'default' },
            {
              label: 'Estado',
              valor: conectado ? 'Conectado' : 'Desconectado',
              editable: false,
              icono: 'wifi-outline',
              puntoEstado: conectado ? 'conectado' : 'desconectado',
            },
          ]}
          onGuardar={() => {}}
        />
        <TarjetaNotificaciones />
        <View style={{ marginHorizontal: 16 }}>
          <BotonCancelar text="Cerrar sesión" onPress={handleCerrarSesion} />
        </View>
      </ScrollView>
    </View>
  );
}