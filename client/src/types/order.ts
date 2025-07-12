export interface Order {
  id: string;
  orderId: string;
  status: "Posted" | "On Hold" | "In Progress" | "Dispatched" | "Completed" | "Canceled";
  customerName: string;
  phoneNumber: string;
  pickupStart: string; // YYYY-MM-DD format
  pickupEnd: string; // YYYY-MM-DD format
  dispatchDay: string; // YYYY-MM-DD format
  bookingDate: string; // YYYY-MM-DD format
  brokerFee: number;
  totalPrice: number;
  userId: string;
  userEmail?: string; // Added to store user email for better identification
  createdAt: string;
}

export interface OrderFormData {
  orderId: string;
  status: string;
  customerName: string;
  phoneNumber: string;
  pickupStart: string;
  pickupEnd: string;
  dispatchDay: string;
  bookingDate: string;
  brokerFee: number;
  totalPrice: number;
}

export interface DashboardStats {
  postedCount: number;
  onHoldCount: number;
  inProgressCount: number;
  dispatchedCount: number;
  completedCount: number;
  canceledCount: number;
  totalCount: number;
  cancellationRate: number;
}

export interface TargetProgress {
  brokerFeeSum: number;
  remaining: number;
  percentageComplete: number;
}

export interface SalaryCalculation {
  amount: number;
  calculation: string;
  targetAchieved: boolean;
}
