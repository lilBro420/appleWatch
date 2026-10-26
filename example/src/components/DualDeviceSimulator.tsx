import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SobrietyProvider, useSobriety } from '../context/SobrietyContext';
import { AppleWatchChassis } from './AppleWatchChassis';
import { IPhoneChassis } from './IPhoneChassis';
import { WatchSobrietyFace } from './WatchSobrietyFace';
import { SobrietyPhoneScreen } from './SobrietyPhoneScreen';

const Stage: React.FC = () => {
  const { activeTracker } = useSobriety();
  const accent = activeTracker?.color ?? '#30D158';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.stage}
      showsVerticalScrollIndicator={false}
    >
      {/* LADO IZQUIERDO: Apple Watch (Visualización de días de sobriedad) */}
      <View style={styles.device}>
        <AppleWatchChassis accentColor={accent}>
          <WatchSobrietyFace />
        </AppleWatchChassis>
        <Text style={styles.captionTitle}>Apple Watch</Text>
        <Text style={styles.caption}>
          Días de sobriedad · Toca para alternar meta
        </Text>
      </View>

      {/* LADO DERECHO: iPhone 15 Pro Max (Control detallado de sobriedad) */}
      <View style={styles.device}>
        <IPhoneChassis>
          <SobrietyPhoneScreen />
        </IPhoneChassis>
        <Text style={styles.captionTitle}>iPhone 15 Pro Max</Text>
        <Text style={styles.caption}>
          Control detallado: Días, Horas, Minutos, Segundos y Fichas
        </Text>
      </View>
    </ScrollView>
  );
};

/** Ambos dispositivos sincronizados en tiempo real mediante SobrietyProvider */
export const DualDeviceSimulator: React.FC = () => (
  <SobrietyProvider>
    <Stage />
  </SobrietyProvider>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  stage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  device: {
    alignItems: 'center',
  },
  captionTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  caption: {
    color: '#6E7681',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 320,
  },
});
