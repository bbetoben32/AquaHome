import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect, useRef } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // ← reemplaza shouldShowAlert
    shouldShowList:   true,  // ← agrega esto
    shouldPlaySound:  true,
    shouldSetBadge:   false,
  }),
});

export async function registrarNotificaciones() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permisos denegados');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alertas', {
      name:             'Alertas de agua',
      importance:       Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#EF4444',
      sound:            'default',
    });
  }
}

export async function enviarNotificacionLocal(titulo: string, cuerpo: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title:   titulo,
      body:    cuerpo,
      sound:   true,
    },
    trigger: null,
  });
}

export function useNotifications() {
  const notificationListener = useRef<any>();
  const responseListener     = useRef<any>();

  useEffect(() => {
    registrarNotificaciones();

    notificationListener.current = Notifications.addNotificationReceivedListener(n => {
      console.log('Notificación recibida:', n.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(r => {
      console.log('Notificación tocada:', r.notification.request.content.title);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
}