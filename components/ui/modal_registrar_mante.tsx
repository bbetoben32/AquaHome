// components/RegistrarMantenimiento.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RegistrarMantenimientoProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: (date: Date) => void;
}

export default function RegistrarMantenimiento({
  visible,
  onClose,
  onConfirm,
}: RegistrarMantenimientoProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay: firstDay === 0 ? 6 : firstDay - 1, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const today = new Date();

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    if (newDate > today) return;
    setSelectedDate(newDate);
  };

  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    newDate.setHours(23, 59, 59);
    if (newDate > today) return;
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onConfirm?.(selectedDate);
    onClose();
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate();
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <View key={`header-${i}`} style={styles.calendarCell}>
          <Text style={styles.weekDayText}>{weekDays[i]}</Text>
        </View>
      );
    }

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const isFuture = thisDate > today;

      days.push(
        <TouchableOpacity
          key={day}
          style={styles.calendarCell}
          onPress={() => selectDay(day)}
          disabled={isFuture}
        >
          <View
            style={[
              styles.dayContainer,
              isSelected(day) && styles.selectedDay,
              isToday(day) && !isSelected(day) && styles.todayDay,
              isFuture && styles.futureDay,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                isSelected(day) && styles.selectedDayText,
                isToday(day) && !isSelected(day) && styles.todayDayText,
                isFuture && styles.futureDayText,
              ]}
            >
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Registrar Mantenimiento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Selecciona la fecha del mantenimiento</Text>

          <View style={styles.calendar}>
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={24} color="#0891B2" />
              </TouchableOpacity>
              <Text style={styles.monthText}>{currentMonth}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={24} color="#0891B2" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
          </View>

          <View style={styles.selectedDateContainer}>
            <Ionicons name="calendar-outline" size={18} color="#0891B2" />
            <Text style={styles.selectedDateText}>
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1E3A5F',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E3A5F',
    textTransform: 'capitalize',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#94A3B8',
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#1E3A5F',
  },
  selectedDay: {
    backgroundColor: '#0891B2',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#0891B2',
  },
  todayDayText: {
    color: '#0891B2',
    fontFamily: 'Poppins_600SemiBold',
  },
  futureDay: {
    opacity: 0.3,
  },
  futureDayText: {
    color: '#CBD5E1',
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0891B2',
    textTransform: 'capitalize',
  },
  confirmButton: {
    backgroundColor: '#0891B2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
});