import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getPriorityColor(priority: 'Low' | 'Medium' | 'High'): string {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-50';
    case 'Medium':
      return 'text-amber-600 bg-amber-50';
    case 'Low':
      return 'text-green-600 bg-green-50';
  }
}

export function getRiskLevelColor(risk: 'Low' | 'Medium' | 'High'): string {
  switch (risk) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
  }
}

export function getSegmentColor(segment: string): string {
  switch (segment) {
    case 'Individual':
      return 'text-blue-600 bg-blue-50';
    case 'SME':
      return 'text-purple-600 bg-purple-50';
    case 'Corporate':
      return 'text-indigo-600 bg-indigo-50';
    case 'Priority':
      return 'text-rose-600 bg-rose-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending':
      return 'text-slate-600 bg-slate-100';
    case 'In progress':
      return 'text-blue-600 bg-blue-100';
    case 'Done':
      return 'text-green-600 bg-green-100';
    case 'Overdue':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getComplaintStatusColor(status: 'None' | 'Open' | 'Resolved'): string {
  switch (status) {
    case 'Open':
      return 'text-red-600 bg-red-50';
    case 'Resolved':
      return 'text-green-600 bg-green-50';
    case 'None':
      return 'text-gray-600 bg-gray-50';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

export function calculateDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateString: string): boolean {
  return calculateDaysUntil(dateString) < 0;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
