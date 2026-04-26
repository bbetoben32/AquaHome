import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  icono?: React.ReactNode;
}

export default function Button({ text, onPress, disabled = false, icono }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.shadow} disabled={disabled}>
      <LinearGradient
        colors={disabled ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'] : ['#0F4C75', '#3282B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {icono && <View style={{ marginRight: 10 }}>{icono}</View>}
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 8,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
    fontSize: 34,
  },
});