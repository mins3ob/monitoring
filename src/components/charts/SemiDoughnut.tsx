'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SemiDoughnutProps {
  activeColor?: string;
  inactiveColor?: string;
  percentage: number;
  size?: number;
}

const SemiDoughnut: React.FC<SemiDoughnutProps> = ({
  activeColor = '#757575',
  inactiveColor = '#e0e0e0',
  percentage,
  size = 250,
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: size,
    },
    plotOptions: {
      pie: {
        startAngle: -135,
        endAngle: 135,
        donut: {
          size: '70%',
        },
      },
    },
    colors: [activeColor, inactiveColor],
    labels: ['Achieved', 'Remaining'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
  };

  const series = [percentage, 100 - percentage];

  return (
    <div
      style={{
        width: size,
        maxWidth: 300,
        height: 250,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ReactApexChart options={options} series={series} type="donut" height={size} />

      <div
        style={{
          position: 'absolute',
          top: '90%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 28,
          fontWeight: 700,
          color: '#757575',
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default SemiDoughnut;
