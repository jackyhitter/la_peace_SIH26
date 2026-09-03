import React from 'react';

export default function TrafficAnalytics() {
  const classBreakdown = [
    { class: 'Cars / Sedans / SUVs', count: 12450, share: '62.4%' },
    { class: 'Motorcycles / Scooters', count: 4890, share: '24.5%' },
    { class: 'Commercial Trucks', count: 1210, share: '6.1%' },
    { class: 'Public Buses', count: 840, share: '4.2%' },
    { class: 'Auto Rickshaws', count: 560, share: '2.8%' }
  ];

  const hourlyFlow = [
    { hour: '14:00 - 15:00', total: 2410, avg_speed: '47.2 km/h', congestion: 'LOW' },
    { hour: '15:00 - 16:00', total: 3120, avg_speed: '41.8 km/h', congestion: 'MODERATE' },
    { hour: '16:00 - 17:00', total: 4680, avg_speed: '32.1 km/h', congestion: 'HIGH' },
    { hour: '17:00 - 18:00', total: 5410, avg_speed: '26.4 km/h', congestion: 'SEVERE' }
  ];

  return (
    <div className="raw-split">
      <div className="raw-box">
        <div className="raw-box-title">[MODULE: ANALYTICS] - HOURLY VEHICLE FLOW & CONGESTION</div>
        <table className="raw-table">
          <thead>
            <tr>
              <th>TIME_WINDOW</th>
              <th>VEHICLE_COUNT</th>
              <th>AVG_SPEED</th>
              <th>CONGESTION_LEVEL</th>
            </tr>
          </thead>
          <tbody>
            {hourlyFlow.map((h, i) => (
              <tr key={i}>
                <td>{h.hour}</td>
                <td>{h.total}</td>
                <td>{h.avg_speed}</td>
                <td>{h.congestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="raw-box">
        <div className="raw-box-title">[VEHICLE CLASSIFICATION DISTRIBUTION]</div>
        <table className="raw-table">
          <thead>
            <tr>
              <th>CATEGORY</th>
              <th>COUNT</th>
              <th>SHARE</th>
            </tr>
          </thead>
          <tbody>
            {classBreakdown.map((c, i) => (
              <tr key={i}>
                <td>{c.class}</td>
                <td>{c.count}</td>
                <td>{c.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
