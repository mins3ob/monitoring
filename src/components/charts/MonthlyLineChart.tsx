import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MonthlyLineChartProps {
  currentYearData: number[];
  pastYearData: number[];
  labels: string[];
}

const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({
  currentYearData,
  pastYearData,
  labels,
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#757575', '#e0e0e0'],
    grid: {
      borderColor: '#f0f2f5',
      strokeDashArray: 0,
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: '#b0b0b0',
          fontSize: '13px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#b0b0b0',
          fontSize: '13px',
        },
      },
      min: 0,
      max: 1000,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      markers: {
        size: 12,
        shape: 'circle',
      },
      itemMargin: {
        horizontal: 20,
      },
      labels: {
        colors: '#757575',
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  const series = [
    {
      name: 'Current Year',
      data: currentYearData,
    },
    {
      name: 'Past Year',
      data: pastYearData,
    },
  ];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={400}
        style={{ background: '#fff', borderRadius: 8, padding: 16 }}
      />
    </div>
  );
};

export default MonthlyLineChart;
