'use client';

import React, { useState } from 'react';

import Calendar from '@components/Calendar';

import WeekCalendarForm from '@components/projects/WeekCalendarForm';

const dummyData = [
  {
    date: '2025-05-01',
    value: [
      {
        event: '일반',
        lots: [
          { id: 'lot101-12312-123', time: new Date() },
          { id: 'lot101-t43235-535', time: new Date() },
        ],
      },
      {
        event: '항속',
        lots: [{ id: 'lot102-12312-123', time: new Date() }],
      },
    ],
  },
  {
    date: '2025-05-05',
    value: [
      {
        event: '일반',
        lots: [
          { id: 'lot201-12312-123', time: new Date() },
          { id: 'lot201-12312-124', time: new Date() },
          { id: 'lot201-12312-125', time: new Date() },
        ],
      },
      {
        event: '항속',
        lots: [
          { id: 'lot202-12312-123', time: new Date() },
          { id: 'lot202-12312-124', time: new Date() },
        ],
      },
    ],
  },
  {
    date: '2025-05-10',
    value: [
      {
        event: '일반',
        lots: [{ id: 'lot301-12312-123', time: new Date() }],
      },
      {
        event: '항속',
        lots: [
          { id: 'lot302-12312-123', time: new Date() },
          { id: 'lot302-12312-124', time: new Date() },
        ],
      },
    ],
  },
  {
    date: '2025-05-15',
    value: [
      {
        event: '일반',
        lots: [
          { id: 'lot401-12312-123', time: new Date() },
          { id: 'lot401-12312-124', time: new Date() },
          { id: 'lot401-12312-125', time: new Date() },
        ],
      },
      {
        event: '항속',
        lots: [{ id: 'lot402-12312-123', time: new Date() }],
      },
    ],
  },
  {
    date: '2025-05-20',
    value: [
      {
        event: '일반',
        lots: [
          { id: 'lot501-12312-123', time: new Date() },
          { id: 'lot501-12312-124', time: new Date() },
        ],
      },
      {
        event: '항속',
        lots: [
          { id: 'lot503-12312-123', time: new Date() },
          { id: 'lot503-12312-124', time: new Date() },
        ],
      },
    ],
  },
];

const monthCalendarData = dummyData.map(item => ({
  date: item.date,
  content: (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {item.value.map((v, index) => (
          <tr key={index}>
            <td style={{ padding: '2px', border: '1px solid #ddd' }}>{v.event}</td>
            <td style={{ padding: '2px', border: '1px solid #ddd', textAlign: 'center' }}>
              {v.lots.length}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

const weekCalendarData = dummyData.map(item => ({
  date: item.date,
  value: item.value,
}));

export default function CalendarForm() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showWeekCalendar, setShowWeekCalendar] = useState(false);

  const handleDateSelect = (date: Date) => {
    console.log(date);
    setSelectedDate(date);
    setShowWeekCalendar(!showWeekCalendar);
  };

  const clickBack = (): void => {
    setShowWeekCalendar(false);
  };

  console.log('s :', selectedDate);

  return (
    <div className="column">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>프로젝트 캘린더</h2>
      </div>

      <div className="box">
        <div className="row" style={{ padding: '20px' }}>
          {!showWeekCalendar ? (
            <Calendar dateContents={monthCalendarData} onDateSelect={handleDateSelect} />
          ) : (
            <WeekCalendarForm
              selectedDate={selectedDate}
              dateContents={weekCalendarData}
              back={clickBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
