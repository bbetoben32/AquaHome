// components/MaintenanceCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegistrarMantenimiento from './modal_registrar_mante';

interface MaintenanceCardProps {
  daysRemaining?: number;
  totalDays?: number;
  onMaintenanceRegistered?: (date: Date) => void;
}

export default function MaintenanceCard({
  daysRemaining = 47,
  totalDays = 90,
  onMaintenanceRegistered,
}: MaintenanceCardProps) {
  const [showElapsed, setShowElapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const daysElapsed = totalDays - daysRemaining;
  const progress = (daysElapsed / totalDays) * 100;

  const handleBarPress = () => {
    setShowElapsed(true);
  };

  const handleContainerPress = () => {
    if (showElapsed) {
      setShowElapsed(false);
    }
  };

  const handleConfirm = (date: Date) => {
    onMaintenanceRegistered?.(date);
  };

  return (
    <>
      <Pressable style={styles.container} onPress={handleContainerPress}>
        <View style={styles.header}>
          <Text style={styles.title}>Próximo Mantenimiento</Text>
          <Text style={styles.subtitle}>Recomendación estimada</Text>
        </View>

        <Pressable onPress={handleBarPress}>
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.daysContainer}>
              <Text style={styles.daysNumber}>{daysRemaining}</Text>
              <Text style={styles.daysLabel}>días</Text>
            </View>
          </View>
          {showElapsed && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>
                {daysElapsed} días sin mantenimiento
              </Text>
            </View>
          )}
        </Pressable>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Registrar Mantenimiento</Text>
        </TouchableOpacity>
      </Pressable>

      <RegistrarMantenimiento
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1E3A5F',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0891B2',
    borderRadius: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  daysNumber: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#059669',
  },
  daysLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: '#059669',
  },
  tooltip: {
    position: 'absolute',
    top: -28,
    left: 0,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  button: {
    backgroundColor: '#0891B2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
});