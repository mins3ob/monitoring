'use client';

import React from 'react';

import Table from '@components/Table';

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

export default function WeekCalendarForm({
  selectedDate,
  dateContents = [],
  back,
}: IWeekCalendarForm) {
  const weekDates = getWeekDates(selectedDate);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const uniqueEventNames = Array.from(
    new Set(
      dateContents
        .filter(content => weekDates.some(date => formatDate(date) === content.date))
        .flatMap(content => content.value.map(event => event.event))
    )
  );

  return (
    <div style={{ width: '100%' }}>
      <button type="button" onClick={back} style={{ marginBottom: 20 }}>
        뒤로가기
      </button>

      <Table>
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
          {/* {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const dateContent = dateContents.find(content => content.date === dateStr);
            const events = dateContent?.value || [];

            return (
              <tr key={index}>
                <td>{formatDisplayDate(date, weekdays[date.getDay()])}</td>
                <td style={{ padding: 0, height: 0 }}>
                  <EventCell events={events} />
                </td>
                <td style={{ padding: 0, height: 0 }}>
                  <QuantityCell events={events} />
                </td>
                <td style={{ padding: 0 }}>
                  <LotCell events={events} />
                </td>
                <td style={{ padding: 0 }}>
                  <TimeCell events={events} />
                </td>
                <td></td>
              </tr>
            );
          })} */}
          {weekDates.map((date, dateIndex) => {
            const dateStr = formatDate(date);
            const dateContent = dateContents.find(content => content.date === dateStr);
            const events = dateContent?.value || [];

            const totalLots = events.reduce((sum, e) => sum + e.lots.length, 0);

            if (totalLots === 0) {
              return (
                <tr key={dateIndex}>
                  <td>{formatDisplayDate(date, weekdays[date.getDay()])}</td>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    -
                  </td>
                </tr>
              );
            }

            let renderedDate = false;

            return events.flatMap((event, eIdx) => {
              return event.lots.map((lot, lotIdx) => {
                return (
                  <tr key={`${dateStr}-${eIdx}-${lotIdx}`}>
                    {!renderedDate && (
                      <td rowSpan={totalLots} style={{ verticalAlign: 'middle' }}>
                        {formatDisplayDate(date, weekdays[date.getDay()])}
                      </td>
                    )}
                    {lotIdx === 0 && (
                      <>
                        <td rowSpan={event.lots.length}>{event.event}</td>
                        <td rowSpan={event.lots.length}>{event.lots.length}</td>
                      </>
                    )}
                    <td>{lot.id}</td>
                    <td>
                      {lot.time.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    {lotIdx === 0 && <td rowSpan={event.lots.length}></td>}
                    {(renderedDate = true) && null}
                  </tr>
                );
              });
            });
          })}

          {uniqueEventNames.map((eventName, idx) => {
            const quantity = dateContents
              .filter(content => weekDates.some(date => formatDate(date) === content.date))
              .reduce((total, content) => {
                const event = content.value.find(e => e.event === eventName);
                return total + (event?.lots.length || 0);
              }, 0);

            return (
              <tr key={eventName}>
                {idx === 0 && (
                  <td
                    rowSpan={uniqueEventNames.length}
                    style={{ fontWeight: 'bold', padding: '0.75rem' }}
                  >
                    합계
                  </td>
                )}
                <td style={{ fontWeight: 'bold', padding: '0.75rem' }}>{eventName}</td>
                <td style={{ fontWeight: 'bold', padding: '0.75rem' }}>{quantity}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
