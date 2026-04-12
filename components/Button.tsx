import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export default function Button({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1a5a9f',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});