import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import AnimatedTabBar from '../../components/ui/barra_navegacion';
import 'react-native-gesture-handler';

export default function TabsLayout() {
  return (
  <Tabs
    screenOptions={{ headerShown: false }}
    tabBar={(props) => (
        <View style={estilos.barraContainer}>
        <AnimatedTabBar
            activeIndex={props.state.index}
            onTabChange={(index) => {
            const routes = props.state.routes;
            if (index < routes.length) {
                props.navigation.jumpTo(routes[index].name);
            }
            }}
        />
        </View>
    )}
    >
    <Tabs.Screen name="dashboard" />
    <Tabs.Screen name="historial" />
    <Tabs.Screen name="notificacion" />
    <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  barraContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
});