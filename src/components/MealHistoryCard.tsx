import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Meal, MealType } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/theme';

interface MealHistoryCardProps {
  meal: Meal;
  onPressCapture: (type: MealType) => void;
  onPressViewResult: (meal: Meal) => void;
}

export const MealHistoryCard: React.FC<MealHistoryCardProps> = ({
  meal,
  onPressCapture,
  onPressViewResult,
}) => {
  const getStatusDetails = () => {
    switch (meal.status) {
      case 'SAFE':
        return {
          icon: '🟢',
          text: 'An toàn / Đúng thực đơn',
          bgColor: COLORS.safeGreenLight,
          textColor: COLORS.safeGreen,
          borderColor: COLORS.safeGreen
        };
      case 'WARNING':
        return {
          icon: '🟡',
          text: 'Hạn chế / Cần lưu ý',
          bgColor: COLORS.warningYellowLight,
          textColor: COLORS.warningYellow,
          borderColor: COLORS.warningYellow
        };
      case 'DANGER':
        return {
          icon: '🔴',
          text: 'Cần tránh / Sai thực đơn',
          bgColor: COLORS.dangerRedLight,
          textColor: COLORS.dangerRed,
          borderColor: COLORS.dangerRed
        };
      case 'PENDING':
        return {
          icon: '⏳',
          text: 'Đang phân tích...',
          bgColor: '#F3F4F6',
          textColor: COLORS.textSecondary,
          borderColor: COLORS.border
        };
      case 'EMPTY':
      default:
        return {
          icon: '📷',
          text: 'Chưa chụp ảnh bữa ăn',
          bgColor: '#F9FAFB',
          textColor: COLORS.textMuted,
          borderColor: COLORS.border
        };
    }
  };

  const status = getStatusDetails();

  // 1. GIAO DIỆN KHI CHƯA CHỤP ẢNH BỮA ĂN (Mặt định - Trạng thái trống)
  if (meal.status === 'EMPTY') {
    return (
      <TouchableOpacity 
        style={[styles.container, styles.emptyContainer]} 
        onPress={() => onPressCapture(meal.type)}
        activeOpacity={0.7}
      >
        <View style={styles.emptyLeft}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>📸</Text>
          </View>
          <View style={styles.emptyTextContainer}>
            <Text style={styles.mealNameTitle}>{meal.displayName}</Text>
            <Text style={styles.emptySubText}>Mẹ bấm vào đây để chụp ảnh nhé!</Text>
          </View>
        </View>
        <View style={styles.captureTextButton}>
          <Text style={styles.captureText}>Chụp</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 2. GIAO DIỆN KHI ĐANG PHÂN TÍCH (PENDING)
  if (meal.status === 'PENDING') {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingLeft}>
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
          <View>
            <Text style={styles.mealNameTitle}>{meal.displayName}</Text>
            <Text style={styles.loadingText}>Đang kiểm tra món ăn...</Text>
          </View>
        </View>
      </View>
    );
  }

  // 3. GIAO DIỆN KHI ĐÃ CÓ KẾT QUẢ PHÂN TÍCH (SAFE, WARNING, DANGER)
  return (
    <View style={[styles.container, { borderColor: status.borderColor, borderWidth: 2 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.mealNameTitle}>{meal.displayName}</Text>
        <Text style={styles.timeText}>{meal.timeString}</Text>
      </View>

      <View style={styles.bodyRow}>
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={{ fontSize: 24 }}>🍲</Text>
          </View>
        )}
        
        <View style={styles.infoCol}>
          {/* Nhãn Đèn Giao Thông */}
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusBadgeText, { color: status.textColor }]}>
              {status.icon} {status.text}
            </Text>
          </View>
          
          <Text style={styles.foodLabel} numberOfLines={1}>
            Thức ăn: <Text style={styles.foodValue}>{meal.advice ? meal.advice.match(/"([^"]+)"/)?.[1] || 'Món ăn đã quét' : 'Đã chụp'}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: status.borderColor }]} 
        onPress={() => onPressViewResult(meal)}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>Xem Lời Khuyên Dinh Dưỡng ➜</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: SPACING.lg,
    backgroundColor: '#F0F4FF',
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTextContainer: {
    flex: 1,
  },
  mealNameTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
  },
  emptySubText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  captureTextButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 14,
  },
  captureText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  loadingContainer: {
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
  },
  loadingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  timeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageFallback: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  statusBadgeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  foodLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  foodValue: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionButton: {
    paddingVertical: SPACING.sm,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
