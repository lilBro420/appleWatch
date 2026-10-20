import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AppleWatchChassisProps {
  children: React.ReactNode;
  accentColor: string;
}

/**
 * Chasis oficial con forma de Apple Watch (Ultra / Series).
 * Incluye la Digital Crown con aro de acento, botón lateral,
 * esquinas curvadas de zafiro y correas deportivas.
 */
export const AppleWatchChassis: React.FC<AppleWatchChassisProps> = ({
  children,
  accentColor,
}) => {
  return (
    <View style={styles.outerWrapper}>
      {/* Correa Superior Deportiva */}
      <View style={styles.strapTop}>
        <View style={styles.strapRidge} />
        <View style={styles.strapRidge} />
        <View style={styles.strapRidge} />
      </View>

      {/* Caja del Apple Watch */}
      <View style={styles.caseContainer}>
        {/* Orificio de Micrófono Izquierdo */}
        <View style={styles.micHole} />

        {/* Caja de Titanio / Aluminio */}
        <View style={styles.watchCase}>
          {/* Bisel Interior Oscuro */}
          <View style={styles.innerBezel}>
            {/* Pantalla Curva OLED */}
            <View style={styles.screen}>
              {children}
              {/* Reflejo de Cristal Curvo */}
              <View pointerEvents="none" style={styles.glassReflection} />
            </View>
          </View>
        </View>

        {/* Botones Laterales Derechos: Digital Crown y Botón Lateral */}
        <View style={styles.crownContainer}>
          {/* Digital Crown */}
          <View style={styles.digitalCrown}>
            <View style={[styles.crownAccentRing, { backgroundColor: accentColor }]} />
            <View style={styles.crownGrooves}>
              <View style={styles.crownNotch} />
              <View style={styles.crownNotch} />
              <View style={styles.crownNotch} />
            </View>
          </View>
          {/* Botón Lateral Plano */}
          <View style={styles.sideButton} />
        </View>
      </View>

      {/* Correa Inferior Deportiva */}
      <View style={styles.strapBottom}>
        <View style={styles.strapRidge} />
        <View style={styles.strapRidge} />
        <View style={styles.strapRidge} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  strapTop: {
    width: 172,
    height: 48,
    backgroundColor: '#181B20',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2D333B',
    borderBottomWidth: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 4,
    opacity: 0.95,
  },
  strapBottom: {
    width: 172,
    height: 48,
    backgroundColor: '#181B20',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2D333B',
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 4,
    opacity: 0.95,
  },
  strapRidge: {
    width: '78%',
    height: 2,
    backgroundColor: '#272C34',
    borderRadius: 1,
  },
  caseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  micHole: {
    position: 'absolute',
    left: -4,
    top: '46%',
    width: 4,
    height: 14,
    backgroundColor: '#16181D',
    borderRadius: 2,
  },
  watchCase: {
    width: 294,
    height: 360,
    backgroundColor: '#252932',
    borderRadius: 54,
    padding: 7,
    borderWidth: 2,
    borderColor: '#464E5E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 26,
    elevation: 20,
  },
  innerBezel: {
    flex: 1,
    backgroundColor: '#0A0C0E',
    borderRadius: 48,
    padding: 3,
    borderWidth: 1,
    borderColor: '#191D24',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0C0F14',
    borderRadius: 44,
    overflow: 'hidden',
    position: 'relative',
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
  },
  crownContainer: {
    position: 'absolute',
    right: -14,
    top: '18%',
    height: 180,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  digitalCrown: {
    width: 14,
    height: 64,
    backgroundColor: '#2D323C',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: '#485162',
    borderLeftWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  crownAccentRing: {
    width: 3.5,
    height: '75%',
    borderRadius: 2,
    position: 'absolute',
    left: 2,
  },
  crownGrooves: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingRight: 1,
  },
  crownNotch: {
    width: 5,
    height: 2,
    backgroundColor: '#191C22',
  },
  sideButton: {
    width: 7,
    height: 48,
    backgroundColor: '#242730',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#3D4452',
    borderLeftWidth: 0,
    marginTop: 24,
  },
});
