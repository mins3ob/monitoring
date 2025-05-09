'use client';

import React from 'react';

import CSS from './Contents.module.css';

import PercentageChangeLabel from '@components/labels/PercentageChangeLabel';
import { monthlyLabels } from '@constants/index';

import SemiDoughnut from '@components/charts/SemiDoughnut';
import MonthlyLineChart from '@components/charts/MonthlyLineChart';

export default function Dashboard() {
  const currentYearData = [400, 500, 600, 550, 580, 700, 750, 800, 780, 700, 650, 900];
  const pastYearData = [300, 400, 500, 480, 500, 650, 700, 750, 730, 650, 600, 850];

  return (
    <div className={CSS.column}>
      <h2>대시보드</h2>

      <div className={CSS.row}>
        <div className={CSS.box}>
          <h6>Total Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={2.5} />
          </div>
        </div>

        <div className={CSS.box}>
          <h6>Active Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={-1.2} />
          </div>
        </div>

        <div className={CSS.box}>
          <h6>Inactive Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={1.1} />
          </div>
        </div>

        <div className={CSS.box}>
          <h6>Completed Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={11} />
          </div>
        </div>
      </div>

      <div className={CSS.row}>
        <div className={CSS.box}>
          <h5>Process</h5>

          <div className={CSS.legendContainer}>
            <div className={CSS.legendItem}>
              <div className={CSS.legendColor} style={{ background: '#757575' }}></div>

              <span className={CSS.legendLabel}>Achieved</span>
            </div>
            <div className={CSS.legendItem}>
              <div className={CSS.legendColor} style={{ background: '#e0e0e0' }}></div>

              <span className={CSS.legendLabel}>Remaining</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SemiDoughnut percentage={67} />
          </div>
        </div>

        <div className={CSS.box}>
          <h5>Process</h5>

          <div className={CSS.legendContainer}>
            <div className={CSS.legendItem}>
              <div className={CSS.legendColor} style={{ background: '#757575' }}></div>

              <span className={CSS.legendLabel}>Achieved</span>
            </div>
            <div className={CSS.legendItem}>
              <div className={CSS.legendColor} style={{ background: '#e0e0e0' }}></div>

              <span className={CSS.legendLabel}>Remaining</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SemiDoughnut percentage={67} />
          </div>
        </div>
      </div>

      <div className={CSS.row}>
        <div className={CSS.box}>
          <MonthlyLineChart
            labels={monthlyLabels}
            currentYearData={currentYearData}
            pastYearData={pastYearData}
          />
        </div>
      </div>
    </div>
  );
}
