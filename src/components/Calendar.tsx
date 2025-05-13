import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface ICalendar {
  onDateSelect?: (date: Date) => void;
  dateContents?: Array<{
    date: string;
    content: React.ReactNode;
  }>;
}

export default function Calendar({ onDateSelect, dateContents = [] }: ICalendar) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    // 요일 헤더 렌더링
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`header-${i}`}
          className={`${styles.dayHeader} ${i === 0 || i === 6 ? styles.weekend : ''}`}
        >
          {weekdays[i]}
        </div>
      );
    }

    // 이전 달의 날짜들
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      const currentDateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateContent = dateContents.find(content => content.date === currentDateStr);

      days.push(
        <button
          key={day}
          className={`${styles.day}  ${isToday ? styles.today : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <p>{day}</p>

          <div className={styles.content}>{dateContent?.content}</div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.monthButton} onClick={handlePrevMonth}>
          &lt;
        </button>

        <div className={styles.monthDisplay}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </div>

        <button className={styles.monthButton} onClick={handleNextMonth}>
          &gt;
        </button>
      </div>
      <div className={styles.grid}>{renderCalendarDays()}</div>
    </div>
  );
}
