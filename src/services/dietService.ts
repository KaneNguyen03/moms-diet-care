import { Meal, MealStatus, MealType } from '../types';
import { getDietRule } from '../data/dietPlan';

interface AnalysisResult {
  status: MealStatus;
  advice: string;
}

/**
 * Hàm phân tích món ăn tự động dựa trên từ khóa (Giả lập trí tuệ nhân tạo OCR quét ảnh bữa ăn)
 * @param foodName Tên món ăn mẹ nhập hoặc quét từ ảnh
 * @param mealType Bữa ăn trong ngày (sáng, trưa, tối)
 * @param dayNumber Ngày thứ mấy trong lộ trình 14 ngày (1-14)
 */
export const analyzeMeal = (
  foodName: string,
  mealType: MealType,
  dayNumber: number
): AnalysisResult => {
  const text = foodName.toLowerCase().trim();
  const ruleType = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';
  const rules = getDietRule(dayNumber, ruleType);

  // 1. Kiểm tra xem món ăn trống hay không
  if (!text) {
    return {
      status: 'EMPTY',
      advice: 'Mẹ chưa chọn hoặc nhập món ăn nào.'
    };
  }

  // 2. Tìm kiếm từ khóa CẤM (🔴 DANGER)
  const matchedForbidden = rules.forbidden.find(item => text.includes(item)) || 
                           // Thêm một số từ khóa cấm mặc định chung cho người già/sau sinh
                           ['mì tôm', 'mi tom', 'rượu', 'bia', 'cà phê', 'ca phe', 'nước ngọt', 'nuoc ngot', 'lòng lợn', 'long lon', 'đồ chiên rán nhiều mỡ', 'kfc', 'fastfood'].find(item => text.includes(item));
  
  if (matchedForbidden) {
    return {
      status: 'DANGER',
      advice: `🔴 CẦN TRÁNH: Món "${foodName}" chứa các thành phần có hại cho sức khỏe của mẹ (như chất béo bão hòa, nhiều gia vị kích thích hoặc quá nhiều muối đường). Mẹ hãy hạn chế tối đa và đổi sang món thanh đạm hơn nhé!`
    };
  }

  // 3. Tìm kiếm từ khóa HẠN CHẾ (🟡 WARNING)
  const matchedRestricted = rules.restricted.find(item => text.includes(item)) ||
                            // Các từ khóa hạn chế mặc định chung
                            ['kho', 'chiên', 'rán', 'xào', 'nướng', 'mặn', 'cay', 'bánh ngọt', 'dưa chua', 'cà muối'].find(item => text.includes(item));

  if (matchedRestricted) {
    return {
      status: 'WARNING',
      advice: `🟡 HẠN CHẾ: Món "${foodName}" có thể ăn được nhưng cần lưu ý chế biến giảm gia vị, giảm dầu mỡ. Mẹ nên ăn lượng vừa phải và nhớ uống nhiều nước lọc sau đó nhé.`
    };
  }

  // 4. Tìm kiếm từ khóa AN TOÀN (🟢 SAFE)
  const matchedAllowed = rules.allowed.find(item => text.includes(item)) ||
                         // Từ khóa an toàn mặc định
                         ['cháo', 'chao', 'súp', 'sup', 'luộc', 'luoc', 'hấp', 'hap', 'rau', 'cơm', 'com', 'sữa', 'sua', 'trứng', 'trung', 'khoai'].find(item => text.includes(item));

  if (matchedAllowed) {
    return {
      status: 'SAFE',
      advice: `🟢 AN TOÀN: Món "${foodName}" rất xuất sắc! Đồ ăn mềm, dễ tiêu, chế biến thanh đạm rất hợp với thực đơn phục hồi sức khỏe cột sống và cơ sàn chậu của mẹ hôm nay.`
    };
  }

  // 5. Trường hợp không trùng từ khóa đặc biệt nào (Mặc định An toàn nhẹ nhàng)
  return {
    status: 'SAFE',
    advice: `🟢 ĐẠT YÊU CẦU: Món "${foodName}" có vẻ là một lựa chọn lành mạnh. Để bảo vệ cột sống và giữ dáng, mẹ chú ý nấu ít muối, hạn chế dầu mỡ động vật và bổ sung nhiều nước nhé.`
  };
};

/**
 * Giả lập API tải lên và phân tích bữa ăn sau 2 giây trì hoãn (Simulated Network Latency)
 */
export const uploadAndAnalyzeMealApi = (
  mealId: string,
  foodName: string,
  imageUrl: string,
  mealType: MealType,
  dayNumber: number
): Promise<Meal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = analyzeMeal(foodName, mealType, dayNumber);
      const updatedMeal: Meal = {
        id: mealId,
        type: mealType,
        displayName: mealType === 'BREAKFAST' ? 'Bữa Sáng' : mealType === 'LUNCH' ? 'Bữa Trưa' : 'Bữa Tối',
        timeString: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        imageUrl: imageUrl,
        status: analysis.status,
        advice: analysis.advice,
        timestamp: new Date()
      };
      resolve(updatedMeal);
    }, 2000); // 2 giây loading cho giống thật
  });
};
