import { StyleSheet } from 'react-native';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: 'white',
    letterSpacing: 6,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
  },
});