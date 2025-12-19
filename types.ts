
export enum MessageCategory {
  DELIVERY = 'Delivery',
  BANKING = 'Banking',
  APPOINTMENT = 'Appointment',
  TRAVEL = 'Travel',
  PROMOTION = 'Promotion',
  REMINDER = 'Reminder',
  BILL_PAYMENT = 'Bill Payment',
  GENERAL = 'General'
}

export interface Entity {
  label: string;
  value: string;
}

export interface AnalyzedMessage {
  id: string;
  originalText: string;
  category: MessageCategory;
  entities: Entity[];
  summary: string;
  timestamp: Date;
}

export interface AnalysisResponse {
  category: MessageCategory;
  entities: Entity[];
  summary: string;
}
