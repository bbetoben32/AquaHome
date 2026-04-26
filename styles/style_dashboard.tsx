import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({

  
  container: {
    flex: 1,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 20,
  },
  titulo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#0F4C75',
    alignSelf: 'flex-start',
  },
  barraContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },

  scroll: {
    gap: 20,
    paddingBottom: 120,
  },
});