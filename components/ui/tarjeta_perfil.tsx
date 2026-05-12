import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CampoInfo {
  label: string;
  valor: string;
  editable?: boolean;
  secureText?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icono?: keyof typeof Ionicons.glyphMap;
  puntoEstado?: 'conectado' | 'desconectado';
}

interface TarjetaInfoProps {
  campos: CampoInfo[];
  onGuardar?: (label: string, nuevoValor: string) => void;
}

function CampoEditable({
  campo,
  onGuardar,
}: {
  campo: CampoInfo;
  onGuardar?: (label: string, nuevoValor: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(campo.valor);
  const [valorTemp, setValorTemp] = useState(campo.valor);

  // ← actualiza cuando el prop cambia externamente
  useEffect(() => {
    if (!editando) {
      setValor(campo.valor);
      setValorTemp(campo.valor);
    }
  }, [campo.valor]);

  const handleEditar = () => {
    setValorTemp(valor);
    setEditando(true);
  };

  const handleGuardar = () => {
    setValor(valorTemp);
    setEditando(false);
    onGuardar?.(campo.label, valorTemp);
  };

  const handleCancelar = () => {
    setValorTemp(valor);
    setEditando(false);
  };

  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoLabel}>{campo.label}:</Text>
      <View style={estilos.campoFila}>
        {editando ? (
          <TextInput
            style={estilos.input}
            value={valorTemp}
            onChangeText={setValorTemp}
            secureTextEntry={campo.secureText}
            keyboardType={campo.keyboardType ?? 'default'}
            autoFocus
            onSubmitEditing={handleGuardar}
            returnKeyType="done"
          />
        ) : (
          <View style={estilos.valorConPunto}>
            {campo.puntoEstado && (
              <View
                style={[
                  estilos.punto,
                  {
                    backgroundColor:
                      campo.puntoEstado === 'conectado' ? '#22C55E' : '#EF4444',
                  },
                ]}
              />
            )}
            <Text style={estilos.campoValor} numberOfLines={1}>
              {campo.secureText ? '•'.repeat(valor.length) : valor}
            </Text>
          </View>
        )}

        {campo.editable !== false && (
          <View style={estilos.acciones}>
            {editando ? (
              <>
                <TouchableOpacity onPress={handleGuardar} style={estilos.botonAccion}>
                  <Ionicons name="checkmark" size={20} color="#0891B2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelar} style={estilos.botonAccion}>
                  <Ionicons name="close" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleEditar} style={estilos.botonAccion}>
                <Ionicons name="create-outline" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {campo.icono && !editando && (
          <TouchableOpacity style={estilos.botonAccion}>
            <Ionicons name={campo.icono} size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function TarjetaInfo({ campos, onGuardar }: TarjetaInfoProps) {
  return (
    <View style={estilos.tarjeta}>
      {campos.map((campo, index) => (
        <View key={campo.label}>
          <CampoEditable campo={campo} onGuardar={onGuardar} />
          {index < campos.length - 1 && <View style={estilos.separador} />}
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  campo: {
    paddingVertical: 12,
  },
  campoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  campoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valorConPunto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  campoValor: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A5F',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#1E3A5F',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0891B2',
    paddingVertical: 2,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  acciones: {
    flexDirection: 'row',
    gap: 4,
  },
  botonAccion: {
    padding: 4,
  },
  separador: {
    height: 0.5,
    backgroundColor: '#E2E8F0',
  },
});