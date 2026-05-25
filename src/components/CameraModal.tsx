import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { MealType } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/theme';

interface CameraModalProps {
  visible: boolean;
  mealType: MealType;
  onClose: () => void;
  onCapture: (foodName: string, simulatedImageUrl: string) => void;
}

// Danh sách các món ăn Việt Nam giả lập chất lượng cao cho MVP (Có sẵn ảnh mẫu & phân loại ngầm để demo)
const PRESET_MEALS = [
  {
    name: 'Cháo Cá Chép Ấm',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop',
    type: 'SAFE',
    emoji: '🟢'
  },
  {
    name: 'Rau Cải Ngọt Luộc',
    image: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?q=80&w=400&auto=format&fit=crop',
    type: 'SAFE',
    emoji: '🟢'
  },
  {
    name: 'Cá Kho Tộ Nhiều Muối',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
    type: 'WARNING',
    emoji: '🟡'
  },
  {
    name: 'Thịt Ba Chỉ Rán Giòn',
    image: 'https://images.unsplash.com/photo-1602491453979-02654b3a8a6a?q=80&w=400&auto=format&fit=crop',
    type: 'WARNING',
    emoji: '🟡'
  },
  {
    name: 'Mì Ăn Liền Sợi Úp',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop',
    type: 'DANGER',
    emoji: '🔴'
  },
  {
    name: 'Đĩa Lòng Lợn Luộc',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
    type: 'DANGER',
    emoji: '🔴'
  }
];

export const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  mealType,
  onClose,
  onCapture,
}) => {
  const [customFood, setCustomFood] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  const getMealNameInVietnamese = () => {
    switch (mealType) {
      case 'BREAKFAST': return 'Bữa Sáng';
      case 'LUNCH': return 'Bữa Trưa';
      case 'DINNER': return 'Bữa Tối';
      default: return 'Bữa Ăn';
    }
  };

  const handleCapture = () => {
    // 1. Nếu có món tự nhập
    if (customFood.trim()) {
      // Giả lập một hình ảnh món ăn chung ngẫu nhiên trên mạng
      const randomFoodImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop';
      onCapture(customFood.trim(), randomFoodImage);
      resetState();
      return;
    }

    // 2. Nếu chọn một món preset sẵn
    if (selectedPresetIndex !== null) {
      const preset = PRESET_MEALS[selectedPresetIndex];
      onCapture(preset.name, preset.image);
      resetState();
      return;
    }

    // 3. Nếu chưa chọn gì cả, mặc định chọn món số 1 để tránh lỗi treo app cho người già
    const defaultPreset = PRESET_MEALS[0];
    onCapture(defaultPreset.name, defaultPreset.image);
    resetState();
  };

  const resetState = () => {
    setCustomFood('');
    setSelectedPresetIndex(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header của Camera - To và dễ nhìn */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕ HỦY BỎ</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chụp {getMealNameInVietnamese()}</Text>
          <View style={{ width: 80 }} /> {/* Giữ khoảng cách cân bằng */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Màn hình Ống ngắm Camera giả lập (Simulated Viewfinder) */}
          <View style={styles.viewfinderContainer}>
            <View style={styles.viewfinder}>
              {selectedPresetIndex !== null ? (
                <Image source={{ uri: PRESET_MEALS[selectedPresetIndex].image }} style={styles.viewfinderImage} />
              ) : (
                <View style={styles.viewfinderPlaceholder}>
                  <Text style={styles.viewfinderEmoji}>🍲</Text>
                  <Text style={styles.viewfinderPlaceholderText}>Mẹ hãy chọn món ăn hoặc nhập tên ở dưới nhé!</Text>
                </View>
              )}
              {/* Khung căn chỉnh tư thế chụp */}
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
              <View style={styles.gridLineHorizontal} />
              <View style={styles.gridLineVertical} />
            </View>
            <Text style={styles.helperText}>📷 Cố định đĩa thức ăn ở giữa khung hình</Text>
          </View>

          {/* Hộp lựa chọn nhanh món ăn (Dành cho người già ngại gõ phím) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>👉 Mẹ vừa ăn món gì thế? (Chọn nhanh):</Text>
            
            <View style={styles.presetsGrid}>
              {PRESET_MEALS.map((preset, index) => {
                const isSelected = selectedPresetIndex === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.presetCard,
                      isSelected && styles.presetCardSelected
                    ]}
                    onPress={() => {
                      setSelectedPresetIndex(index);
                      setCustomFood(''); // Xóa text tự nhập nếu chọn preset
                    }}
                  >
                    <Image source={{ uri: preset.image }} style={styles.presetImage} />
                    <View style={styles.presetInfo}>
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                      <Text style={styles.presetName} numberOfLines={2}>{preset.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Ô nhập thủ công nếu muốn */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>✍️ Hoặc tự viết tên món ăn của mẹ:</Text>
            <TextInput
              style={styles.textInput}
              value={customFood}
              onChangeText={(text) => {
                setCustomFood(text);
                setSelectedPresetIndex(null); // Bỏ chọn preset nếu tự gõ
              }}
              placeholder="Ví dụ: Bún chả, cơm rang dưa bò..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </ScrollView>

        {/* Nút chụp khổng lồ ở đáy màn hình (One-Button Flow) */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.shutterButton} 
            onPress={handleCapture}
            activeOpacity={0.85}
          >
            <View style={styles.shutterInnerCircle}>
              <Text style={styles.shutterText}>📸 CHỤP NGAY</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Nền tối như màn hình camera thật
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: '#1F2937',
  },
  closeButton: {
    backgroundColor: '#374151',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 150, // Tránh đè lên nút chụp ở đáy
  },
  viewfinderContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  viewfinder: {
    width: 320,
    height: 240,
    backgroundColor: '#000000',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  viewfinderPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  viewfinderEmoji: {
    fontSize: 54,
    marginBottom: SPACING.sm,
  },
  viewfinderPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  cornerTopLeft: { position: 'absolute', top: 15, left: 15, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FFFFFF' },
  cornerTopRight: { position: 'absolute', top: 15, right: 15, width: 30, height: 30, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FFFFFF' },
  cornerBottomLeft: { position: 'absolute', bottom: 15, left: 15, width: 30, height: 30, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FFFFFF' },
  cornerBottomRight: { position: 'absolute', bottom: 15, right: 15, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FFFFFF' },
  gridLineHorizontal: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  gridLineVertical: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  helperText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  sectionContainer: {
    backgroundColor: '#1F2937',
    marginHorizontal: SPACING.md,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: SPACING.sm,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    backgroundColor: '#374151',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#4B5563',
  },
  presetCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#1E40AF',
  },
  presetImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  presetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs + 2,
  },
  presetEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  presetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#4B5563',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    paddingBottom: 40,
    paddingTop: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#374151',
  },
  shutterButton: {
    width: 250,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EF4444', // Màu đỏ khẩn cấp của nút chụp
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.button,
  },
  shutterInnerCircle: {
    width: '95%',
    height: '90%',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
});
