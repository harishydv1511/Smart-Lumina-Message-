
import React from 'react';
import { MessageCategory } from './types';

export const CATEGORY_STYLES: Record<MessageCategory, { color: string, icon: React.ReactNode }> = {
  [MessageCategory.DELIVERY]: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <i className="fas fa-box"></i> },
  [MessageCategory.BANKING]: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <i className="fas fa-university"></i> },
  [MessageCategory.APPOINTMENT]: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <i className="fas fa-calendar-check"></i> },
  [MessageCategory.TRAVEL]: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <i className="fas fa-plane"></i> },
  [MessageCategory.PROMOTION]: { color: 'bg-pink-100 text-pink-700 border-pink-200', icon: <i className="fas fa-tags"></i> },
  [MessageCategory.REMINDER]: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <i className="fas fa-bell"></i> },
  [MessageCategory.BILL_PAYMENT]: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <i className="fas fa-file-invoice-dollar"></i> },
  [MessageCategory.GENERAL]: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <i className="fas fa-comment"></i> },
};

export const SYSTEM_INSTRUCTION = `
You are an advanced NLP assistant specialized in personal message organization.
Analyze the provided message and extract structured data without any sentiment analysis.
Identify the most relevant category from: Delivery, Banking, Appointment, Travel, Promotion, Reminder, Bill Payment, General.
Extract entities such as order IDs, tracking numbers, transaction amounts, dates, times, service providers (Amazon, DHL, etc.), and locations.
Summarize the key action or information in one short sentence.

Return ONLY a JSON object with the following schema:
{
  "category": "string",
  "entities": [{"label": "string", "value": "string"}],
  "summary": "string"
}
`;
