import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Meal } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/theme';

interface ResultModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ visible, meal, onClose }) => {
  if (!meal) return null;

  const getStatusConfig = () => {
    switch (meal.status) {
      case 'SAFE':
        return {
          title: 'AN TOÀN / ĐÚNG THỰC ĐƠN',
          subTitle: '🟢 Bữa Ăn Tuyệt Vời!',
          color: COLORS.safeGreen,
          bgColor: COLORS.safeGreenLight,
          emoji: '🟢'
        };
      case 'WARNING':
        return {
          title: 'HẠN CHẾ / LƯU Ý KHI ĂN',
          subTitle: '🟡 Mẹ Ăn Một Lượng Vừa Phải Nhé',
          color: COLORS.warningYellow,
          bgColor: COLORS.warningYellowLight,
          emoji: '🟡'
        };
      case 'DANGER':
        return {
          title: 'CẦN TRÁNH / SAI THỰC ĐƠN',
          subTitle: '🔴 Cảnh Báo Sức Khỏe',
          color: COLORS.dangerRed,
          bgColor: COLORS.dangerRedLight,
          emoji: '🔴'
        };
      default:
        return {
          title: 'CHƯA PHÂN TÍCH',
          subTitle: '⚪ Vui Lòng Thử Lại',
          color: COLORS.textSecondary,
          bgColor: COLORS.border,
          emoji: '⚪'
        };
    }
  };

  const status = getStatusConfig();
  
  // Tách lời khuyên ra khỏi tên món ăn để hiển thị to rõ hơn
  const displayAdvice = meal.advice || 'Không có lời khuyên dinh dưỡng cụ thể.';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Thanh tiêu đề đỉnh màn hình */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Kết Quả Kiểm Tra Bữa Ăn</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Card trạng thái Đèn Giao Thông */}
          <View style={[styles.statusCard, { backgroundColor: status.bgColor, borderColor: status.color }]}>
            <Text style={[styles.statusEmoji, { textShadowColor: status.color }]}>
              {status.emoji}
            </Text>
            <Text style={[styles.statusTitle, { color: status.color }]}>
              {status.title}
            </Text>
            <Text style={styles.statusSubTitle}>{status.subTitle}</Text>
          </View>

          {/* Chi tiết đĩa thức ăn */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>🍲 Hình ảnh món ăn đã chụp:</Text>
            {meal.imageUrl ? (
              <Image source={{ uri: meal.imageUrl }} style={styles.foodImage} />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={{ fontSize: 60 }}>🍲</Text>
              </View>
            )}
            
            <View style={styles.foodNameContainer}>
              <Text style={styles.foodNameLabel}>Mẹ đã ăn:</Text>
              <Text style={styles.foodNameValue}>
                {displayAdvice.match(/"([^"]+)"/)?.[1] || 'Đĩa ăn dinh dưỡng'}
              </Text>
            </View>
          </View>

          {/* Khuyên nhủ chi tiết dành cho người già (Cỡ chữ siêu to 22px!) */}
          <View style={styles.adviceSection}>
            <View style={styles.adviceHeaderRow}>
              <Text style={styles.adviceHeaderIcon}>🩺</Text>
              <Text style={styles.adviceHeaderTitle}>Lời Khuyên Bác Sĩ:</Text>
            </View>
            
            <View style={styles.adviceContentBox}>
              <Text style={styles.adviceText}>{displayAdvice}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Nút đóng khổng lồ ở đáy (One-Button flow) */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.dismissButton, { backgroundColor: COLORS.primary }]} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissButtonText}>✓ MẸ ĐÃ HIỂU RỒI</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.border,
  },
  topBarTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 130, // Chừa khoảng trống cho nút đáy
  },
  statusCard: {
    borderRadius: 24,
    borderWidth: 3,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  statusEmoji: {
    fontSize: 72,
    marginBottom: SPACING.xs,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  statusSubTitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  detailSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  sectionLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageFallback: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    width: '100%',
    justifyContent: 'center',
  },
  foodNameLabel: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  foodNameValue: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    fontWeight: '900',
  },
  adviceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  adviceHeaderIcon: {
    fontSize: 32,
    marginRight: SPACING.xs,
  },
  adviceHeaderTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.primary,
    fontWeight: '800',
  },
  adviceContentBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.md,
  },
  adviceText: {
    fontSize: 21, // Phóng to chữ cực đại cho người già
    color: COLORS.primaryDark,
    lineHeight: 32,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    paddingBottom: 40,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  dismissButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  dismissButtonText: {
    fontSize: 24, // Cỡ chữ nút to khổng lồ
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
