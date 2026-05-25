import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Meal, MealType } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme/theme';
import { Header } from '../components/Header';
import { MealHistoryCard } from '../components/MealHistoryCard';
import { CameraModal } from '../components/CameraModal';
import { ResultModal } from '../components/ResultModal';
import { uploadAndAnalyzeMealApi } from '../services/dietService';

export const HomeScreen: React.FC = () => {
  // 1. Quản lý trạng thái Lộ trình 14 ngày (Mặc định bắt đầu từ Ngày 1)
  const [currentDay, setCurrentDay] = useState(1);

  // 2. Khởi tạo danh sách 3 bữa ăn trống cho ngày hiện tại
  const [meals, setMeals] = useState<{ [key in MealType]: Meal }>({
    BREAKFAST: { id: 'b1', type: 'BREAKFAST', displayName: 'Bữa Sáng', status: 'EMPTY' },
    LUNCH: { id: 'b2', type: 'LUNCH', displayName: 'Bữa Trưa', status: 'EMPTY' },
    DINNER: { id: 'b3', type: 'DINNER', displayName: 'Bữa Tối', status: 'EMPTY' },
  });

  // 3. Quản lý trạng thái đóng mở Modals
  const [cameraVisible, setCameraVisible] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>('BREAKFAST');
  const [resultVisible, setResultVisible] = useState(false);
  const [selectedMealResult, setSelectedMealResult] = useState<Meal | null>(null);

  // 4. Reset bữa ăn mỗi khi chuyển ngày (Giả lập trải nghiệm sang ngày mới)
  useEffect(() => {
    setMeals({
      BREAKFAST: { id: `b1-d${currentDay}`, type: 'BREAKFAST', displayName: 'Bữa Sáng', status: 'EMPTY' },
      LUNCH: { id: `b2-d${currentDay}`, type: 'LUNCH', displayName: 'Bữa Trưa', status: 'EMPTY' },
      DINNER: { id: `b3-d${currentDay}`, type: 'DINNER', displayName: 'Bữa Tối', status: 'EMPTY' },
    });
  }, [currentDay]);

  // 5. Tự động nhận diện Bữa ăn theo thời gian thực (Giảm thiểu thao tác cho người già)
  const autoDetectMealType = (): MealType => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour <= 10) {
      return 'BREAKFAST'; // 5h - 10h là Bữa sáng
    } else if (currentHour > 10 && currentHour <= 15) {
      return 'LUNCH';     // 10h1 - 15h là Bữa trưa
    } else {
      return 'DINNER';    // Sau 15h là Bữa tối
    }
  };

  const handlePressMainShutter = () => {
    const detectedType = autoDetectMealType();
    
    // Kiểm tra xem bữa ăn đã được chụp chưa, nếu chụp rồi thì hỏi có muốn chụp đè không
    if (meals[detectedType].status !== 'EMPTY') {
      Alert.alert(
        '⚠️ Bữa ăn đã ghi nhận',
        `Mẹ đã chụp ảnh ${meals[detectedType].displayName} rồi. Mẹ có muốn chụp lại bữa này không?`,
        [
          { text: 'Quay lại', style: 'cancel' },
          { 
            text: 'Chụp Đè Bữa Mới', 
            style: 'destructive',
            onPress: () => openCameraFor(detectedType)
          }
        ]
      );
    } else {
      openCameraFor(detectedType);
    }
  };

  const openCameraFor = (type: MealType) => {
    setActiveMealType(type);
    setCameraVisible(true);
  };

  // 6. Xử lý chụp ảnh và kích hoạt tiến trình phân tích bất đồng bộ
  const handleCaptureMeal = async (foodName: string, simulatedImageUrl: string) => {
    setCameraVisible(false);

    // Bước A: Đặt trạng thái Bữa ăn thành Đang phân tích (PENDING)
    setMeals(prev => ({
      ...prev,
      [activeMealType]: {
        ...prev[activeMealType],
        status: 'PENDING',
        imageUrl: simulatedImageUrl
      }
    }));

    try {
      // Bước B: Gọi API giả lập phân tích (Mất 2 giây)
      const analyzedMeal = await uploadAndAnalyzeMealApi(
        meals[activeMealType].id,
        foodName,
        simulatedImageUrl,
        activeMealType,
        currentDay
      );

      // Bước C: Cập nhật kết quả phân tích vào state
      setMeals(prev => ({
        ...prev,
        [activeMealType]: analyzedMeal
      }));

      // Bước D: Tự động mở Modal kết quả phân tích để Mẹ xem lời khuyên ngay lập tức!
      setSelectedMealResult(analyzedMeal);
      setResultVisible(true);

    } catch (error) {
      console.error("Lỗi phân tích bữa ăn: ", error);
      // Fallback nếu lỗi
      setMeals(prev => ({
        ...prev,
        [activeMealType]: {
          ...prev[activeMealType],
          status: 'EMPTY'
        }
      }));
    }
  };

  const handleViewMealResult = (meal: Meal) => {
    setSelectedMealResult(meal);
    setResultVisible(true);
  };

  // 7. Tính toán tiến trình hoàn thành trong ngày (Streak Progress)
  const getStreakData = () => {
    const completedMeals = Object.values(meals).filter(
      meal => meal.status === 'SAFE' || meal.status === 'WARNING' || meal.status === 'DANGER'
    ).length;

    let streakMessage = '';
    let emoji = '❤️';

    if (completedMeals === 0) {
      streakMessage = 'Mẹ chưa chụp bữa nào hôm nay. Hãy bắt đầu thôi mẹ ơi!';
      emoji = '🌸';
    } else if (completedMeals === 1) {
      streakMessage = 'Xuất sắc! Mẹ đã chụp được 1 bữa rồi. Cố gắng tiếp tục nhé!';
      emoji = '👏';
    } else if (completedMeals === 2) {
      streakMessage = 'Tuyệt vời! Chỉ còn 1 bữa tối/sáng nữa là hoàn thành ngày hôm nay!';
      emoji = '🌟';
    } else if (completedMeals === 3) {
      streakMessage = 'Quá tuyệt vời! Mẹ đã hoàn thành chụp 3/3 bữa hôm nay! 🎉';
      emoji = '🎉';
    }

    return {
      completedCount: completedMeals,
      message: streakMessage,
      emoji: emoji
    };
  };

  const streak = getStreakData();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header - Tiêu đề & Chọn ngày */}
      <Header
        currentDay={currentDay}
        onPrevDay={() => currentDay > 1 && setCurrentDay(currentDay - 1)}
        onNextDay={() => currentDay < 14 && setCurrentDay(currentDay + 1)}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Streak Tracker Card - Cỡ lớn, động viên người già */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakEmoji}>{streak.emoji}</Text>
            <Text style={styles.streakTitle}>Tiến Độ Ăn Uống Hôm Nay</Text>
          </View>
          <Text style={styles.streakProgressText}>
            Mẹ đã chụp: <Text style={styles.streakHighlight}>{streak.completedCount} / 3</Text> bữa ăn
          </Text>
          
          {/* Thanh Tiến Độ Trực Quan */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${(streak.completedCount / 3) * 100}%` }]} />
          </View>
          
          <Text style={styles.streakMotivation}>{streak.message}</Text>
        </View>

        {/* NÚT CHỤP ẢNH KHỔNG LỒ (CENTRAL ACTION BUTTON - ONE-BUTTON FLOW) */}
        <View style={styles.shutterContainer}>
          <TouchableOpacity
            style={styles.mainShutterButton}
            onPress={handlePressMainShutter}
            activeOpacity={0.85}
          >
            <View style={styles.shutterInnerCircle}>
              <Text style={styles.shutterEmoji}>📸</Text>
              <Text style={styles.shutterText}>CHỤP ẢNH BỮA ĂN</Text>
              <Text style={styles.shutterSubText}>Tự động phát hiện bữa hiện tại</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danh sách 3 bữa ăn trong ngày */}
        <View style={styles.mealsListSection}>
          <Text style={styles.listSectionTitle}>📋 Lịch Sử Ăn Uống Hôm Nay</Text>
          
          <MealHistoryCard
            meal={meals.BREAKFAST}
            onPressCapture={openCameraFor}
            onPressViewResult={handleViewMealResult}
          />
          
          <MealHistoryCard
            meal={meals.LUNCH}
            onPressCapture={openCameraFor}
            onPressViewResult={handleViewMealResult}
          />
          
          <MealHistoryCard
            meal={meals.DINNER}
            onPressCapture={openCameraFor}
            onPressViewResult={handleViewMealResult}
          />
        </View>

      </ScrollView>

      {/* Camera Modal Giả lập */}
      <CameraModal
        visible={cameraVisible}
        mealType={activeMealType}
        onClose={() => setCameraVisible(false)}
        onCapture={handleCaptureMeal}
      />

      {/* Result Modal - Đèn Giao Thông & Lời Khuyên */}
      <ResultModal
        visible={resultVisible}
        meal={selectedMealResult}
        onClose={() => setResultVisible(false)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.md + 4,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.card,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  streakEmoji: {
    fontSize: 28,
    marginRight: 6,
  },
  streakTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.primary,
  },
  streakProgressText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  streakHighlight: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  progressBarContainer: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginVertical: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  streakMotivation: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  shutterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  mainShutterButton: {
    width: 280,
    height: 200,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.button,
    borderWidth: 6,
    borderColor: COLORS.primaryLight,
  },
  shutterInnerCircle: {
    width: '96%',
    height: '96%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  shutterEmoji: {
    fontSize: 64,
    lineHeight: 70,
  },
  shutterText: {
    fontSize: 23,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  shutterSubText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  mealsListSection: {
    marginTop: SPACING.sm,
  },
  listSectionTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontWeight: '800',
  },
});
