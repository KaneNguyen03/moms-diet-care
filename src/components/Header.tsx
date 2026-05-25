import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

interface HeaderProps {
  currentDay: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDay, onPrevDay, onNextDay }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoHeart}>❤️</Text>
          <Text style={styles.logoText}>Dinh Dưỡng Của Mẹ</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👵</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Bộ chọn Ngày trong lộ trình 14 ngày - Cỡ to, dễ bấm cho người già */}
      <View style={styles.daySelector}>
        <TouchableOpacity 
          style={[styles.arrowButton, currentDay <= 1 && styles.disabledButton]} 
          onPress={onPrevDay}
          disabled={currentDay <= 1}
          accessibilityLabel="Quay lại ngày trước"
        >
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>
        
        <View style={styles.dayTextContainer}>
          <Text style={styles.dayLabel}>Lộ Trình 14 Ngày</Text>
          <Text style={styles.dayValue}>Ngày thứ {currentDay}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.arrowButton, currentDay >= 14 && styles.disabledButton]} 
          onPress={onNextDay}
          disabled={currentDay >= 14}
          accessibilityLabel="Sang ngày tiếp theo"
        >
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    paddingTop: 50, // Tránh tai thỏ (Safe Area)
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoHeart: {
    fontSize: 28,
    marginRight: 6,
  },
  logoText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.sm,
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dayTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayValue: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.primary,
    fontWeight: '800',
  },
});
