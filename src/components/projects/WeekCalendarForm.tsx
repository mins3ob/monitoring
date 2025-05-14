'use client';

import React from 'react';

import styles from './WeekCalendarForm.module.css';

// Types
interface Lot {
  id: string;
  time: Date;
}

interface Event {
  event: string;
  lots: Lot[];
}

interface DateContent {
  date: string;
  value: Event[];
}

interface IWeekCalendarForm {
  selectedDate: Date;
  dateContents?: DateContent[];
  back: () => void;
}

// Utils
const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

const formatDisplayDate = (date: Date, weekday: string): string => {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate()
  ).padStart(2, '0')} (${weekday})`;
};

const getWeekDates = (date: Date): Date[] => {
  const result = [];
  const firstDay = new Date(date);
  const day = firstDay.getDay();
  const diff = firstDay.getDate() - day;

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(firstDay);
    newDate.setDate(diff + i);
    result.push(newDate);
  }

  return result;
};

// Components
const EventCell: React.FC<{ events: Event[] }> = ({ events }) => (
  <ul>
    {events.length === 0 ? (
      <li>-</li>
    ) : (
      events.map((item, idx) => (
        <li key={idx} style={{ height: item.lots.length * 30 }}>
          {item.event}
        </li>
      ))
    )}
  </ul>
);

const QuantityCell: React.FC<{ events: Event[] }> = ({ events }) => (
  <ul>
    {events.length === 0 ? (
      <li>-</li>
    ) : (
      events.map((item, idx) => (
        <li key={idx} style={{ height: item.lots.length * 30 }}>
          {item.lots.length}
        </li>
      ))
    )}
  </ul>
);

const LotCell: React.FC<{ events: Event[] }> = ({ events }) => (
  <ul>
    {events.length === 0 ? (
      <li>-</li>
    ) : (
      events.map((item, idx) => (
        <li key={idx} style={{ height: item.lots.length * 30 }}>
          <ul>
            {item.lots.map((lot, lotIdx) => (
              <li key={lotIdx}>{lot.id}</li>
            ))}
          </ul>
        </li>
      ))
    )}
  </ul>
);

const TimeCell: React.FC<{ events: Event[] }> = ({ events }) => (
  <ul>
    {events.length === 0 ? (
      <li>-</li>
    ) : (
      events.map((item, idx) => (
        <li key={idx} style={{ height: item.lots.length * 30 }}>
          <ul>
            {item.lots.map((lot, lotIdx) => (
              <li key={lotIdx}>
                {lot.time.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </li>
            ))}
          </ul>
        </li>
      ))
    )}
  </ul>
);

export default function WeekCalendarForm({
  selectedDate,
  dateContents = [],
  back,
}: IWeekCalendarForm) {
  const weekDates = getWeekDates(selectedDate);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div style={{ width: '100%' }}>
      <button type="button" onClick={back} style={{ marginBottom: 20 }}>
        뒤로가기
      </button>

      <table className={styles.table}>
        <colgroup>
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>

        <thead>
          <tr>
            <th rowSpan={2}>날짜</th>
            <th colSpan={2}>계획</th>
            <th colSpan={2}>실적</th>
            <th rowSpan={2}>비고</th>
          </tr>

          <tr>
            <th>사양</th>
            <th>수량</th>
            <th>LOT</th>
            <th>출하 시간</th>
          </tr>
        </thead>

        <tbody>
          {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const dateContent = dateContents.find(content => content.date === dateStr);
            const events = dateContent?.value || [];

            return (
              <tr key={index}>
                <td>{formatDisplayDate(date, weekdays[date.getDay()])}</td>
                <td>
                  <EventCell events={events} />
                </td>
                <td>
                  <QuantityCell events={events} />
                </td>
                <td>
                  <LotCell events={events} />
                </td>
                <td>
                  <TimeCell events={events} />
                </td>
                <td></td>
              </tr>
            );
          })}

          <tr style={{ background: 'var(--gray-100)' }}>
            <td style={{ fontWeight: 'bold' }}>합계</td>
            <td style={{ fontWeight: 'bold' }}>
              <ul>
                {Array.from(
                  new Set(dateContents.flatMap(content => content.value.map(event => event.event)))
                ).map(eventName => (
                  <li key={eventName}>{eventName}</li>
                ))}
              </ul>
            </td>
            <td style={{ fontWeight: 'bold' }}>
              <ul>
                {Array.from(
                  new Set(dateContents.flatMap(content => content.value.map(event => event.event)))
                ).map(eventName => (
                  <li key={eventName}>
                    {dateContents
                      .filter(content => weekDates.some(date => formatDate(date) === content.date))
                      .reduce((total, content) => {
                        const event = content.value.find(e => e.event === eventName);
                        return total + (event?.lots.length || 0);
                      }, 0)}
                  </li>
                ))}
              </ul>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
