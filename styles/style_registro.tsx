import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  titulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  terminosContainer: {
    marginVertical: 12,
  },
  terminosTexto: {
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    fontSize: 14,
  },
  terminosLink: {
    color: '#64b5f6',
    fontFamily: 'Poppins_600SemiBold',
  },
  botonContainer: {
    marginTop: 8,
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
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
});