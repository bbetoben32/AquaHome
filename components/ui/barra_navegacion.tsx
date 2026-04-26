import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TAB_COUNT = 4;
const TAB_BAR_WIDTH = width * 0.90;
const TAB_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;
const INDICATOR_WIDTH = 28;
const ICON_SIZE = 26;

const TABS = [
  { name: 'dashboard', icon: 'home-outline', iconActive: 'home' },
  { name: 'historial', icon: 'document-text-outline', iconActive: 'document-text' },
  { name: 'notificaciones', icon: 'notifications-outline', iconActive: 'notifications' },
  { name: 'perfil', icon: 'person-outline', iconActive: 'person' },
];

interface AnimatedTabBarProps {
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

export default function AnimatedTabBar({
  activeIndex: externalIndex,
  onTabChange,
}: AnimatedTabBarProps) {
    const [activeTab, setActiveTab] = React.useState(externalIndex ?? 0);

    // Cambias estas tres:
    const indicatorAnim = useRef(new Animated.Value(activeTab)).current;
    const iconScales = useRef(TABS.map((_, i) => new Animated.Value(i === activeTab ? 1 : 0))).current;
    const iconTranslates = useRef(TABS.map((_, i) => new Animated.Value(i === activeTab ? -6 : 0))).current;

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex !== activeTab) {
      animarCambio(activeTab, externalIndex);
      setActiveTab(externalIndex);
    }
  }, [externalIndex]);

  const animarCambio = (anterior: number, siguiente: number) => {
    Animated.spring(indicatorAnim, {
      toValue: siguiente,
      useNativeDriver: true,
      tension: 180,
      friction: 20,
    }).start();

    Animated.parallel([
      Animated.spring(iconScales[anterior], {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 18,
      }),
      Animated.spring(iconTranslates[anterior], {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 18,
      }),
      Animated.spring(iconScales[siguiente], {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 14,
      }),
      Animated.spring(iconTranslates[siguiente], {
        toValue: -6,
        useNativeDriver: true,
        tension: 200,
        friction: 14,
      }),
    ]).start();
  };

  const handleTabPress = (index: number) => {
    if (index === activeTab) return;
    animarCambio(activeTab, index);
    setActiveTab(index);
    onTabChange?.(index);
  };

  const indicatorX = indicatorAnim.interpolate({
    inputRange: TABS.map((_, i) => i),
    outputRange: TABS.map((_, i) => i * TAB_WIDTH + TAB_WIDTH / 2 - INDICATOR_WIDTH / 2),
  });

  return (
    <View style={estilos.wrapper}>
      <LinearGradient
        colors={['#5AB7F6', '#3282B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={estilos.container}
      >
        <Animated.View
          style={[
            estilos.indicator,
            { transform: [{ translateX: indicatorX }] },
          ]}
        />

        {TABS.map((tab, index) => {
          const isActive = index === activeTab;
          return (
            <TouchableOpacity
              key={tab.name}
              style={estilos.tab}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  estilos.iconWrapper,
                  { transform: [{ translateY: iconTranslates[index] }] },
                ]}
              >
                <Ionicons
                  name={(isActive ? tab.iconActive : tab.icon) as any}
                  size={ICON_SIZE}
                  color="white"
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const estilos = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    width: TAB_BAR_WIDTH,
    height: 70,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#3282B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
    overflow: 'visible',
  },
  indicator: {
    position: 'absolute',
    bottom: 10,
    width: INDICATOR_WIDTH,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F4C75',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});