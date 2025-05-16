'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Table from '@components/Table';
import { ILot } from '@interfaces/index';
import styles from './WeekCalendarForm.module.css';

interface IValue {
  feature: string;
  lots: ILot[];
}

interface DateContent {
  date: string;
  value: IValue[];
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
        .flatMap(content => content.value.map(event => event.feature))
    )
  );

  return (
    <div className={styles.container}>
      <button type="button" onClick={back} style={{ marginBottom: 20 }}>
        <ArrowLeftIcon className="w-4 h-4" />
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
          {weekDates.map((date, dateIndex) => {
            const dateStr = formatDate(date);
            const dateContent = dateContents.find(content => content.date === dateStr);
            const events = dateContent?.value || [];

            const totalLots = events.reduce((sum, e) => sum + e.lots.length, 0);

            if (totalLots === 0) {
              return (
                <tr key={dateIndex}>
                  <td className={styles.dateCell}>
                    {formatDisplayDate(date, weekdays[date.getDay()])}
                  </td>
                  <td colSpan={5} className={styles.emptyCell}>
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
                      <td rowSpan={totalLots} className={styles.dateCell}>
                        {formatDisplayDate(date, weekdays[date.getDay()])}
                      </td>
                    )}
                    {lotIdx === 0 && (
                      <>
                        <td rowSpan={event.lots.length}>{event.feature}</td>
                        <td rowSpan={event.lots.length}>{event.lots.length}</td>
                      </>
                    )}
                    <td className={styles.lotCell}>{lot.id}</td>
                    <td className={styles.timeCell}>
                      {lot.endDate
                        ? new Date(lot.endDate).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
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
                const event = content.value.find(e => e.feature === eventName);
                return total + (event?.lots.length || 0);
              }, 0);

            return (
              <tr key={eventName} className={styles.totalRow}>
                {idx === 0 && <td rowSpan={uniqueEventNames.length}>합계</td>}
                <td>{eventName}</td>
                <td>{quantity}</td>
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
