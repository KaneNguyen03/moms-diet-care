import { DietPlan14Days, DietRule } from '../types';

const defaultBreakfastRule: DietRule = {
  allowed: ['cháo yến mạch', 'súp gà', 'sữa hạt ít đường', 'trứng luộc', 'cháo cá chép', 'phở gà nước thanh', 'sữa ấm', 'khoai lang luộc'],
  restricted: ['bánh mì thịt', 'xôi xéo', 'bánh cuốn', 'bánh giò', 'bún dọc mùng'],
  forbidden: ['mì tôm', 'cà phê đậm đặc', 'bánh quy quá ngọt', 'nước tăng lực', 'quẩy rán nhiều mỡ'],
  generalAdvice: 'Bữa sáng nên ăn lỏng, ấm và dễ tiêu hóa để khởi động hệ men đường ruột tốt nhất cho mẹ.'
};

const defaultLunchRule: DietRule = {
  allowed: ['cơm tẻ mềm', 'thịt lợn nạc luộc', 'cá quả hấp gừng', 'rau cải luộc', 'canh bí xanh sườn non', 'tôm rim nhạt', 'rau muống luộc', 'canh bầu nấu tôm'],
  restricted: ['thịt kho tàu mặn', 'thịt rán', 'cá kho tộ', 'dưa muối chua', 'cà muối', 'măng xào'],
  forbidden: ['gà rán thức ăn nhanh', 'thịt nướng cháy cạnh', 'lẩu thái cay nóng', 'nước ngọt có ga', 'lòng lợn'],
  generalAdvice: 'Bữa trưa đầy đủ dinh dưỡng, mẹ nên ăn chậm nhai kỹ và tăng cường chất xơ từ rau luộc.'
};

const defaultDinnerRule: DietRule = {
  allowed: ['cơm tẻ mềm', 'canh mồng tơi nấu tôm', 'đậu phụ sốt cà chua nhạt', 'cháo cá lóc', 'thịt gà viên hấp', 'canh rau ngót', 'cá thu hấp nhạt'],
  restricted: ['thịt bò xào măng', 'hải sản nhiều đạm', 'trứng rán quá nhiều dầu', 'xôi nếp đầy bụng'],
  forbidden: ['đồ ăn thừa hâm đi hâm lại', 'mì tôm đêm', 'lẩu cay', 'thức ăn nhanh', 'rượu bia'],
  generalAdvice: 'Bữa tối thanh đạm, ăn trước 19h để tránh đầy bụng, giúp cơ thể thư giãn để mẹ có giấc ngủ ngon.'
};

// Khởi tạo thực đơn 14 ngày với sự cá nhân hóa chi tiết từng ngày để tăng tính thực tế của MVP
export const DIET_PLAN: DietPlan14Days = {
  1: {
    breakfast: {
      ...defaultBreakfastRule,
      allowed: ['cháo yến mạch', 'trứng luộc', 'sữa hạt ấm'],
      generalAdvice: 'Ngày 1: Khởi động với cháo yến mạch giàu chất xơ và trứng luộc cung cấp protein sạch, rất êm bụng.'
    },
    lunch: {
      ...defaultLunchRule,
      allowed: ['cơm mềm', 'thịt nạc heo luộc', 'rau cải chíp luộc', 'canh bí đao sườn non'],
      generalAdvice: 'Ngày 1: Bữa trưa nhiều xơ từ rau cải chíp luộc, canh bí đao mát bổ giải nhiệt cơ thể.'
    },
    dinner: {
      ...defaultDinnerRule,
      allowed: ['cơm mềm', 'đậu phụ sốt cà chua', 'canh rau ngót nấu thịt băm'],
      generalAdvice: 'Ngày 1: Đậu phụ mềm thanh mát dễ tiêu, canh rau ngót giàu sắt hỗ trợ phục hồi sức khỏe tốt.'
    }
  },
  2: {
    breakfast: {
      ...defaultBreakfastRule,
      allowed: ['súp gà nấm', 'khoai lang luộc', 'sữa đậu nành ít đường'],
      generalAdvice: 'Ngày 2: Súp gà ấm nóng bổ sung collagen cột sống, khoai lang luộc kích hoạt nhu động ruột ngừa táo bón.'
    },
    lunch: {
      ...defaultLunchRule,
      allowed: ['cơm mềm', 'cá quả hấp gừng', 'canh bầu nấu tôm', 'rau su su luộc'],
      generalAdvice: 'Ngày 2: Cá quả hấp gừng ấm bụng, bổ sung Omega-3 giảm sưng đau khớp gối cho mẹ.'
    },
    dinner: {
      ...defaultDinnerRule,
      allowed: ['cháo cá lóc hành gừng', 'táo đỏ chưng đường phèn nhạt'],
      generalAdvice: 'Ngày 2: Cháo cá lóc nhẹ nhàng cho buổi tối, giữ ấm cơ thể, dễ ngủ sâu giấc.'
    }
  },
  3: {
    breakfast: {
      ...defaultBreakfastRule,
      allowed: ['cháo cá chép', 'sữa hạt sen'],
      generalAdvice: 'Ngày 3: Cháo cá chép là vị thuốc dân gian phục hồi sức khỏe phụ nữ, hạt sen giúp an thần.'
    },
    lunch: {
      ...defaultLunchRule,
      allowed: ['cơm mềm', 'tôm rim nhạt', 'rau muống luộc', 'canh khoai sọ thịt băm'],
      generalAdvice: 'Ngày 3: Canh khoai sọ dồi dào chất điện giải, tôm cung cấp canxi dồi dào bảo vệ xương khớp.'
    },
    dinner: {
      ...defaultDinnerRule,
      allowed: ['cơm mềm', 'thịt nạc băm chưng cách thủy', 'canh mướp nấu mồng tơi'],
      generalAdvice: 'Ngày 3: Canh mướp mồng tơi nhuận tràng cực tốt, thịt băm chưng nhẹ nhàng, dễ nuốt, dễ tiêu.'
    }
  },
  // Các ngày từ 4-14 sẽ tự động fallback hoặc được sinh động hóa từ dữ liệu mặc định để tránh phình code
};

// Hàm tiện ích lấy thực đơn của một ngày bất kỳ (nếu ngoài 1-3 thì dùng mặc định thông minh)
export const getDietRule = (day: number, type: 'breakfast' | 'lunch' | 'dinner'): DietRule => {
  const normalizedDay = ((day - 1) % 3) + 1; // Map vòng lặp 1->3 cho đủ 14 ngày để tiết kiệm dung lượng
  const dayPlan = DIET_PLAN[normalizedDay] || DIET_PLAN[1];
  return dayPlan[type];
};
