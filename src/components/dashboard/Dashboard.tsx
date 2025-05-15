'use client';

import React from 'react';

import styles from './Dashboard.module.css';

import PercentageChangeLabel from '@components/labels/PercentageChangeLabel';

import SemiDoughnut from '@components/charts/SemiDoughnut';
import MonthlyLineChart from '@components/charts/MonthlyLineChart';

export default function Dashboard() {
  const currentYearData = [400, 500, 600, 550, 580, 700, 750, 800, 780, 700, 650, 900];
  const pastYearData = [300, 400, 500, 480, 500, 650, 700, 750, 730, 650, 600, 850];
  const monthlyLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <div className="column">
      <h2>대시보드</h2>

      <div className="row">
        <div className="box">
          <h6>Total Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={2.5} />
          </div>
        </div>

        <div className="box">
          <h6>Active Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={-1.2} />
          </div>
        </div>

        <div className="box">
          <h6>Inactive Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={1.1} />
          </div>
        </div>

        <div className="box">
          <h6>Completed Projects</h6>

          <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
            <h5>10</h5>

            <PercentageChangeLabel label={11} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="box">
          <h5>Process</h5>

          <div className={styles.legendContainer}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#757575' }}></div>

              <span className={styles.legendLabel}>Achieved</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#e0e0e0' }}></div>

              <span className={styles.legendLabel}>Remaining</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SemiDoughnut percentage={67} />
          </div>
        </div>

        <div className="box">
          <h5>Process</h5>

          <div className={styles.legendContainer}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#757575' }}></div>

              <span className={styles.legendLabel}>Achieved</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#e0e0e0' }}></div>

              <span className={styles.legendLabel}>Remaining</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SemiDoughnut percentage={67} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="box">
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
