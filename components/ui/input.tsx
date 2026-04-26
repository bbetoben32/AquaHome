import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const iconoIzquierda = secureTextEntry
    ? (value.length > 0 ? 'eye-outline' : 'lock-closed-outline')
    : icon;

  return (
    <View style={estilos.container}>
      <Text style={estilos.label}>{label}</Text>
      <View style={[estilos.inputContainer, focused && estilos.inputFocused]}>

        <TouchableOpacity
          onPress={() => secureTextEntry && value.length > 0
            ? setMostrarContrasena(!mostrarContrasena)
            : null
          }
          disabled={!secureTextEntry || value.length === 0}
        >
          <Ionicons
            name={mostrarContrasena && value.length > 0 ? 'eye-off-outline' : iconoIzquierda}
            size={20}
            color={focused ? '#3282B8' : '#999'}
            style={estilos.icon}
          />
        </TouchableOpacity>

        <TextInput
          style={estilos.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !mostrarContrasena}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: 'white',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#3282B8',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#333',
  },
});