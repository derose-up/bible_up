// src/utils/toValidDate.ts

export function toValidDate(value: any): Date | null {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  if (value?.toDate && typeof value.toDate === 'function') {
    const date = value.toDate();
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}
