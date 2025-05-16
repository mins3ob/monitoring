'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Calendar from '@components/Calendar';
import WeekCalendarForm from '@components/projects/calendar/WeekCalendarForm';
import { IFeature, ILot } from '../../../interfaces';
import featuresData from '../../../data/features.json';
import lotsData from '../../../data/lots.json';
import Table from '@components/Table';

interface ICalendarData {
  date: string;
  value: {
    feature: string;
    lots: ILot[];
  }[];
}

export default function CalendarForm() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showWeekCalendar, setShowWeekCalendar] = useState(false);
  const [calendarData, setCalendarData] = useState<ICalendarData[]>([]);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  useEffect(() => {
    const processData = () => {
      try {
        const features: IFeature[] = featuresData;
        const lots: ILot[] = lotsData;

        const projectFeatures = features.filter(feature => feature.projectId === projectId);

        const processedData = projectFeatures.map(feature => {
          const featureLots = lots.filter(lot => lot.featureId === feature.id);

          return {
            date: new Date(feature.createdAt).toISOString().split('T')[0],
            value: [
              {
                feature: feature.name,
                lots: featureLots,
              },
            ],
          };
        });

        setCalendarData(processedData);
      } catch (error) {
        console.error('데이터 처리 중 오류 발생:', error);
      }
    };

    if (projectId) {
      processData();
    }
  }, [projectId]);

  const monthCalendarData = calendarData.map(item => ({
    date: item.date,
    content: (
      <Table>
        <colgroup>
          <col style={{ width: '80%' }} />
          <col style={{ width: '20%' }} />
        </colgroup>
        <tbody>
          {item.value.map((v: { feature: string; lots: ILot[] }, index: number) => (
            <tr key={index}>
              <th style={{ padding: '2px', border: '1px solid #ddd' }}>{v.feature}</th>
              <td style={{ padding: '2px', border: '1px solid #ddd', textAlign: 'center' }}>
                {v.lots.length}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ),
  }));

  const weekCalendarData = calendarData;

  const handleDateSelect = (date: Date) => {
    console.log(date);
    setSelectedDate(date);
    setShowWeekCalendar(!showWeekCalendar);
  };

  const clickBack = (): void => {
    setShowWeekCalendar(false);
  };

  return (
    <div className="column">
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
