import React from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { TextField, InputAdornment } from '@mui/material';
import { Calendar } from 'lucide-react';

interface Props {
  value: string;        // تاریخ با ارقام انگلیسی (مثلاً "1404/11/22")
  onChange: (date: string) => void;
  label?: string;
}

// تبدیل ارقام فارسی به انگلیسی (برای ذخیره در state)
const toEnglishDigits = (str: string) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728));
};

// تبدیل ارقام انگلیسی به فارسی (برای نمایش کاربر)
const toPersianDigits = (str: string) => {
  if (typeof str !== 'string') return '';
  return str.replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 1728));
};

export default function PersianDatePickerCompact({ value, onChange, label }: Props) {
  // پارس کردن تاریخ انگلیسی به آبجکت DatePicker
  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('/').map(Number);
      return new DatePicker.DateObject({
        calendar: persian,
        locale: persian_fa,
        year,
        month,
        day,
      });
    } catch {
      return null;
    }
  };

  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={parseDate(value)}
      onChange={(date: any) => {
        if (date) {
          // خروجی با ارقام انگلیسی (فرمت YYYY/MM/DD)
          const formatted = date.format('YYYY/MM/DD');
          onChange(toEnglishDigits(formatted));
        } else {
          onChange('');
        }
      }}
      format="YYYY/MM/DD"
      portal // تقویم خارج از کارت رندر می‌شود
      containerStyle={{ width: '100%' }}
      render={(value, openCalendar) => {
        // بررسی می‌کنیم که value حتماً رشته باشد
        const displayValue = value && typeof value === 'string' ? toPersianDigits(value) : '';
        return (
          <TextField
            size="small"
            placeholder={label || 'انتخاب تاریخ'}
            value={displayValue}
            onClick={openCalendar}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Calendar size={18} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: 'white',
                height: 40,
                '& .MuiInputBase-input': {
                  fontFamily: 'inherit',
                },
              },
            }}
          />
        );
      }}
    />
  );
}