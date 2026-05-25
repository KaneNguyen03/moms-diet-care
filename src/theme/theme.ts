export const COLORS = {
  // Bảng màu chính có độ tương phản cao (High Contrast)
  background: '#F9FAFB',     // Nền xám nhạt dịu mắt nhưng sáng rõ
  cardBackground: '#FFFFFF', // Nền thẻ màu trắng tinh khiết
  textPrimary: '#111827',    // Màu chữ chính gần như đen (Contrast Ratio cực cao)
  textSecondary: '#374151',  // Màu chữ phụ xám đậm dễ đọc
  textMuted: '#6B7280',      // Chữ nhạt hơn chút cho thông tin phụ
  
  // Màu thương hiệu chính
  primary: '#1E40AF',        // Xanh lam đậm (Royal Blue) - rõ ràng, tin cậy, tương tương phản tốt với nền trắng
  primaryLight: '#DBEAFE',   // Xanh lam nhạt để làm nền nhấn
  primaryDark: '#1E3A8A',    // Xanh lam cực đậm cho trạng thái nhấn nút
  
  // Hệ thống màu Đèn Giao Thông (Traffic Light System) cho chế độ ăn
  safeGreen: '#047857',      // Xanh lá đậm chuẩn y tế (🟢 An toàn)
  safeGreenLight: '#D1FAE5', // Nền xanh lá nhạt
  warningYellow: '#D97706',  // Vàng cam đậm để dễ đọc hơn màu vàng tươi (🟡 Hạn chế)
  warningYellowLight: '#FEF3C7', // Nền vàng nhạt
  dangerRed: '#B91C1C',      // Đỏ đậm cảnh báo (🔴 Cần tránh)
  dangerRedLight: '#FEE2E2', // Nền đỏ nhạt

  // Các màu bổ trợ
  border: '#E5E7EB',         // Đường viền xám rõ ràng
  overlay: 'rgba(0, 0, 0, 0.7)', // Phủ mờ camera hoặc loading
};

export const TYPOGRAPHY = {
  // Cỡ chữ lớn tối thiểu 18px cho body, 24px cho header theo đúng nguyên tắc Accessibility cho người cao tuổi
  titleLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  titleMedium: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  header: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  bodyLarge: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  bodyMedium: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Cho Android
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  }
};
