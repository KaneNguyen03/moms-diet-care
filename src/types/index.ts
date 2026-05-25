export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type MealStatus = 'EMPTY' | 'PENDING' | 'SAFE' | 'WARNING' | 'DANGER';

export interface Meal {
  id: string;
  type: MealType;
  displayName: string; // "Bữa Sáng", "Bữa Trưa", "Bữa Tối"
  timeString?: string; // "07:30", "12:15", "18:45"
  imageUrl?: string;   // URI ảnh đã chụp hoặc giả lập
  status: MealStatus;
  advice?: string;     // Lời khuyên dinh dưỡng tương ứng
  timestamp?: Date;
}

export interface DayProgress {
  date: string;       // Định dạng YYYY-MM-DD
  meals: {
    BREAKFAST?: Meal;
    LUNCH?: Meal;
    DINNER?: Meal;
  };
  streakCount: number;
}

export interface DietRule {
  allowed: string[];
  restricted: string[];
  forbidden: string[];
  generalAdvice: string;
}

export interface DietPlan14Days {
  [dayNumber: number]: {
    breakfast: DietRule;
    lunch: DietRule;
    dinner: DietRule;
  };
}
