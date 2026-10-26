import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { DualDeviceSimulator } from './components/DualDeviceSimulator';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />

      {/* Encabezado Principal */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          CONTROL DE <Text style={styles.headerAccent}>SOBRIEDAD</Text>
        </Text>
        <Text style={styles.headerSub}>
          Apple Watch (Izquierda) + iPhone 15 Pro Max (Derecha) sincronizados en tiempo real
        </Text>
      </View>

      {/* Simulador Dual: Watch a la izquierda, iPhone a la derecha */}
      <DualDeviceSimulator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E14',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 6,
    paddingHorizontal: 16,
    backgroundColor: '#0B0E14',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerAccent: {
    color: '#30D158',
  },
  headerSub: {
    color: '#6E7681',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 600,
  },
});
