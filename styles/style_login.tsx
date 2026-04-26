import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  olvidaste: {
    fontFamily: 'Poppins_400Regular',
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 24,
    marginTop: 4,
  },
  botonContainer: {
    marginBottom: 20,
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  separadorTexto: {
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    fontSize: 13,
    marginHorizontal: 10,
  },
});