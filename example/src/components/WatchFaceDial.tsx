import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

export interface SubdialContent {
  header: string;
  title?: string;
  value?: string;
  subtitle?: string;
  gaugePercent?: number;
  dateText?: string;
  imageUrl?: string;
}

export interface WatchFaceDialProps {
  accentColor: string;
  watermarkImage?: string;
  subdial12: SubdialContent;
  subdial3: SubdialContent;
  subdial6: SubdialContent;
  subdial9: SubdialContent;
  signatureText?: string;
  loading?: boolean;
  batteryLevel?: number;
  batteryCharging?: boolean;
  batterySupported?: boolean;
  isHardware?: boolean;
}

/**
 * Pantalla inteligente inspirada en los relojes digitales tácticos Casio G-Shock / Pro Trek.
 * Cuenta con el clásico "Ojo de radar" Casio, hora digital de alto contraste,
 * indicadores de Bluetooth/Solar y monitor holográfico de Pokémon.
 */
export const WatchFaceDial: React.FC<WatchFaceDialProps> = ({
  accentColor,
  watermarkImage,
  subdial12,
  subdial3,
  subdial6,
  subdial9,
  signatureText = 'POKÉDEX • ULTRA LINK',
  loading = false,
  batteryLevel = 100,
  batteryCharging = false,
  batterySupported = false,
  isHardware = false,
}) => {
  const [time, setTime] = useState(new Date());
  const [illuminatorOn, setIlluminatorOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');

  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const dayName = days[time.getDay()];
  const dayNum = time.getDate().toString().padStart(2, '0');
  const monthName = months[time.getMonth()];

  // Cálculo de segmentos para el "Ojo / Radar Casio" (10 segmentos)
  const radarSegments = 10;
  const activeRadarSegments = Math.floor((seconds / 60) * radarSegments);

  // Barra de HP = Nivel medido por el sensor de batería del hardware
  const hpPercent = Math.max(0, Math.min(100, Math.round(batteryLevel)));
  const totalHpBlocks = 8;
  const activeHpBlocks = Math.max(0, Math.min(totalHpBlocks, Math.round((hpPercent / 100) * totalHpBlocks)));

  // Color de la barra de vida estilo Pokémon según el sensor de batería:
  // Verde saludable (>50%), Ámbar moderado (21-50%), Rojo crítico (<=20%)
  const hpBarColor =
    hpPercent > 50 ? '#10E760' : hpPercent > 20 ? '#FBBF24' : '#EF4444';

  return (
    <View
      style={[
        styles.lcdContainer,
        illuminatorOn && { backgroundColor: `${accentColor}22` },
      ]}
    >
      {/* Rejilla de Fondo Retro LCD */}
      <View style={styles.lcdGridPattern} />

      {/* Marca de Agua Tecnológica de Fondo */}
      {watermarkImage && (
        <Image
          source={{ uri: watermarkImage }}
          style={styles.watermarkHolo}
          resizeMode="contain"
        />
      )}

      {/* ======================================================== */}
      {/* 1. FRANJA SUPERIOR: LOGO CASIO + INDICADORES SMART       */}
      {/* ======================================================== */}
      <View style={styles.topStatusHeader}>
        <View style={styles.casioBrandBadge}>
          <Text style={styles.casioLogo}>POKÉMON</Text>
          <Text style={[styles.casioSub, { color: accentColor }]}>SMART LINK</Text>
        </View>

        {/* Indicadores de Estado: BT, SENSOR */}
        <View style={styles.statusFlagsRow}>
          <View style={[styles.flagPill, { borderColor: accentColor }]}>
            <Text style={[styles.flagText, { color: accentColor }]}>BT</Text>
          </View>
          {batterySupported && (
            <View style={[styles.flagPill, { borderColor: batteryCharging ? '#10B981' : '#374151' }]}>
              <Text style={[styles.flagText, { color: batteryCharging ? '#10B981' : '#9CA3AF' }]}>
                {batteryCharging ? 'CARGANDO' : 'SENSOR'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ======================================================== */}
      {/* 2. ZONA MEDIA SUPERIOR: HORA DIGITAL PRINCIPAL           */}
      {/* ======================================================== */}
      <View style={styles.timeSectionRow}>
        {/* Bloque Principal de Hora Digital Centrada */}
        <View style={styles.digitalClockBlock}>
          {/* Fila de Fecha en Matriz de Puntos */}
          <View style={styles.dateRow}>
            <Text style={[styles.dayText, { color: accentColor }]}>{dayName}</Text>
            <Text style={styles.dateText}>{dayNum} {monthName}</Text>
          </View>

          {/* Grandes Dígitos LCD */}
          <View style={styles.digitsRow}>
            <Text style={[styles.bigDigit, illuminatorOn && { color: accentColor }]}>
              {hoursStr}
            </Text>
            <Text style={[styles.digitColon, { color: accentColor }]}>:</Text>
            <Text style={[styles.bigDigit, illuminatorOn && { color: accentColor }]}>
              {minutesStr}
            </Text>

            {/* Caja de Segundero Casio */}
            <View style={[styles.secondsBox, { borderColor: accentColor }]}>
              <Text style={[styles.secondsDigits, { color: accentColor }]}>
                {secondsStr}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ======================================================== */}
      {/* 3. MONITOR INTELIGENTE DE POKÉMON (HUD TÁCTICO)          */}
      {/* ======================================================== */}
      <View style={[styles.pokemonHudCard, { borderColor: `${accentColor}66` }]}>
        {/* Cabecera del Monitor */}
        <View style={[styles.hudHeader, { backgroundColor: `${accentColor}1A` }]}>
          <Text style={[styles.hudHeaderTitle, { color: accentColor }]}>
            POKÉMON MONITOR • {subdial12.header}
          </Text>
          <Text style={styles.hudHeaderStatus}>ACTIVO</Text>
        </View>

        {/* Cuerpo con Sprite Pixel-Art y Datos */}
        <View style={styles.hudBody}>
          {/* Ventana de Scanner de Sprite */}
          <View style={[styles.spriteScannerFrame, { borderColor: accentColor }]}>
            {subdial12.imageUrl ? (
              <Image
                source={{ uri: subdial12.imageUrl }}
                style={styles.spriteImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.spritePlaceholder} />
            )}
            <View style={styles.scanlineOverlay} />
          </View>

          {/* Estadísticas de Batalla / Sensores Inteligentes */}
          <View style={styles.hudStatsColumn}>
            {/* Nombre del Pokémon */}
            <Text numberOfLines={1} style={styles.hudPokemonName}>
              {subdial12.title}
            </Text>

            {/* Barra de Vida que toma el Sensor de Batería */}
            <View style={styles.hpSegmentedRow}>
              <Text style={[styles.hpLabel, { color: hpBarColor }]}>HP</Text>
              <View style={styles.hpBlocksContainer}>
                {Array.from({ length: totalHpBlocks }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.hpBlock,
                      i < activeHpBlocks
                        ? { backgroundColor: hpBarColor }
                        : styles.hpBlockInactive,
                    ]}
                  />
                ))}
              </View>
              {batteryCharging && (
                <Text style={[styles.hpNumeric, { color: hpBarColor }]}>⚡</Text>
              )}
            </View>

            {/* Fila de Métricas de Sensores (Ataque, Velocidad, Pasos) */}
            <View style={styles.sensorsRow}>
              <View style={styles.sensorItem}>
                <Text style={styles.sensorKey}>ATK</Text>
                <Text style={[styles.sensorVal, { color: accentColor }]}>
                  {subdial3.value}
                </Text>
              </View>
              <View style={styles.sensorDivider} />
              <View style={styles.sensorItem}>
                <Text style={styles.sensorKey}>SPD</Text>
                <Text style={[styles.sensorVal, { color: accentColor }]}>
                  {subdial6.value}
                </Text>
              </View>
              <View style={styles.sensorDivider} />
              <View style={styles.sensorItem}>
                <Text style={styles.sensorKey}>BAT</Text>
                <Text style={[styles.sensorVal, { color: accentColor }]}>
                  {subdial9.value}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ======================================================== */}
      {/* 4. FRANJA INFERIOR: BOTÓN ILLUMINATOR + TELEMETRÍA       */}
      {/* ======================================================== */}
      <View style={styles.bottomTelemetryRow}>
        <TouchableOpacity
          style={[
            styles.illuminatorButton,
            illuminatorOn && { backgroundColor: accentColor },
          ]}
          onPress={() => setIlluminatorOn(!illuminatorOn)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.illuminatorText,
              illuminatorOn ? { color: '#000000' } : { color: accentColor },
            ]}
          >
            ILLUMINATOR
          </Text>
        </TouchableOpacity>

        <Text style={styles.telemetryTag}>
          {signatureText}
        </Text>
      </View>

      {/* Indicador de Carga */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={accentColor} size="small" />
          <Text style={[styles.loadingText, { color: accentColor }]}>
            SINC POKÉAPI...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lcdContainer: {
    flex: 1,
    backgroundColor: '#0C0F14',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    position: 'relative',
  },
  lcdGridPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 24,
    margin: 4,
  },
  watermarkHolo: {
    position: 'absolute',
    right: -20,
    bottom: 20,
    width: 170,
    height: 170,
    opacity: 0.12,
  },

  /* 1. Header Casio */
  topStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 4,
  },
  casioBrandBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  casioLogo: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  casioSub: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusFlagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagPill: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  flagText: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  flagPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: '#9CA3AF',
  },
  flagTextActive: {
    color: '#F3F4F6',
    fontSize: 7,
    fontWeight: '900',
  },

  /* 2. Sección del Reloj */
  timeSectionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    width: '100%',
  },
  digitalClockBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: -2,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  dateText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigDigit: {
    color: '#F9FAFB',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    fontFamily: 'monospace',
  },
  digitColon: {
    fontSize: 38,
    fontWeight: '900',
    marginHorizontal: 1,
  },
  secondsBox: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
    backgroundColor: '#11151C',
  },
  secondsDigits: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  /* 3. Monitor Inteligente Pokémon */
  pokemonHudCard: {
    backgroundColor: '#11161F',
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  hudHeaderTitle: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hudHeaderStatus: {
    color: '#10B981',
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hudBody: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  spriteScannerFrame: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#090B0E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  spriteImage: {
    width: 44,
    height: 44,
  },
  spritePlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#1F2937',
    borderRadius: 12,
  },
  scanlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  hudStatsColumn: {
    flex: 1,
    marginLeft: 10,
  },
  hudPokemonName: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  hpSegmentedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 4,
  },
  hpLabel: {
    fontSize: 8,
    fontWeight: '900',
    marginRight: 4,
  },
  hpBlocksContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  hpBlock: {
    flex: 1,
    height: 5,
    borderRadius: 1,
  },
  hpBlockInactive: {
    backgroundColor: '#1F2937',
  },
  hpNumeric: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  sensorStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  sensorStatusLabel: {
    color: '#6E7681',
    fontSize: 6.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  sensorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  sensorItem: {
    alignItems: 'center',
  },
  sensorKey: {
    color: '#6B7280',
    fontSize: 6.5,
    fontWeight: '800',
  },
  sensorVal: {
    fontSize: 8.5,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  sensorDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#1F2937',
  },

  /* 4. Franja Inferior */
  bottomTelemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 5,
  },
  illuminatorButton: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  illuminatorText: {
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  telemetryTag: {
    color: '#6B7280',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 15, 20, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  loadingText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 6,
  },
});
