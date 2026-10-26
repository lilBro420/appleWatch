import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IPhoneChassisProps {
  children: React.ReactNode;
}

/**
 * Chasis del iPhone 15 Pro Max: marco de titanio, Dynamic Island,
 * Action Button, botones de volumen y botón de encendido.
 * Proporción real 430 x 932 pt, escalada a 300 x 650.
 */
export const IPhoneChassis: React.FC<IPhoneChassisProps> = ({ children }) => {
  return (
    <View style={styles.wrapper}>
      {/* Botones izquierdos: Action Button + volumen */}
      <View style={[styles.sideBtn, styles.actionButton]} />
      <View style={[styles.sideBtn, styles.volUp]} />
      <View style={[styles.sideBtn, styles.volDown]} />
      {/* Botón derecho: encendido */}
      <View style={[styles.sideBtnRight, styles.powerButton]} />

      {/* Marco de titanio */}
      <View style={styles.titaniumFrame}>
        <View style={styles.bezel}>
          <View style={styles.screen}>
            {children}

            {/* Dynamic Island */}
            <View pointerEvents="none" style={styles.dynamicIsland}>
              <View style={styles.cameraDot} />
            </View>

            {/* Indicador de inicio */}
            <View pointerEvents="none" style={styles.homeIndicator} />

            {/* Reflejo de cristal */}
            <View pointerEvents="none" style={styles.glassReflection} />
          </View>
        </View>
      </View>
    </View>
  );
};

const FRAME_W = 300;
const FRAME_H = 650;

const styles = StyleSheet.create({
  wrapper: {
    width: FRAME_W,
    height: FRAME_H,
    marginVertical: 10,
    position: 'relative',
  },
  titaniumFrame: {
    flex: 1,
    backgroundColor: '#5C5A57',
    borderRadius: 52,
    padding: 3,
    borderWidth: 2,
    borderColor: '#8B8884',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 26,
    elevation: 20,
  },
  bezel: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 49,
    padding: 5,
  },
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 44,
    overflow: 'hidden',
    position: 'relative',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 92,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    zIndex: 100,
  },
  cameraDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#0B1020',
    borderWidth: 1,
    borderColor: '#1B2440',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 7,
    alignSelf: 'center',
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 100,
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    zIndex: 90,
  },
  sideBtn: {
    position: 'absolute',
    left: -3,
    width: 4,
    backgroundColor: '#6E6B67',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  sideBtnRight: {
    position: 'absolute',
    right: -3,
    width: 4,
    backgroundColor: '#6E6B67',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  actionButton: { top: 110, height: 22 },
  volUp: { top: 150, height: 44 },
  volDown: { top: 204, height: 44 },
  powerButton: { top: 170, height: 70 },
});