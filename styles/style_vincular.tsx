import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  titulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  circuloCentro: {
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(5,40,80,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: 100,
    height: 100,
  },
  texto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  botonesContainer: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
});