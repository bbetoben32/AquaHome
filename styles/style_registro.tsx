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

  reqContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  barraFondo: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 6,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: 6,
    borderRadius: 10,
  },
  nivelTexto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'right',
  },
  reqFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconoCirculo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  reqTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  coincidenciaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
    gap: 6,
  },
  coincidenciaTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
});