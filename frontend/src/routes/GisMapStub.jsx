import React from 'react';

export default function GisMapStub() {
  const nodes = [
    { id: 'CAM_01', name: 'Sector 17 North Gate', lat: 30.7398, lng: 76.7827, zone: 'Zone 1' },
    { id: 'CAM_02', name: 'Madhya Marg Junction', lat: 30.7350, lng: 76.7900, zone: 'Zone 2' },
    { id: 'CAM_03', name: 'Tribune Chowk Flyover', lat: 30.7055, lng: 76.7915, zone: 'Zone 3' },
    { id: 'CAM_04', name: 'IT Park Roundabout', lat: 30.7240, lng: 76.8450, zone: 'Zone 4' }
  ];

  return (
    <div className="raw-split">
      <div className="raw-box">
        <div className="raw-box-title">[MODULE: GIS_MAP] - MAPBOX / POSTGIS CONTAINER</div>
        <div style={{
          height: '380px',
          border: '1px solid #000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          color: '#333333'
        }}>
          <div>[GIS / MAPBOX CANVAS PLACEHOLDER]</div>
          <div style={{ fontSize: '11px', marginTop: '6px' }}>BOUNDS: LAT [30.7055 - 30.7398], LNG [76.7827 - 76.8450]</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>ACTIVE CAMERA NODES: 4 | ACTIVE TRAJECTORY VECTORS: 12</div>
        </div>
      </div>

      <div className="raw-box">
        <div className="raw-box-title">[POSTGIS COORDINATE REGISTRY]</div>
        <table className="raw-table">
          <thead>
            <tr>
              <th>NODE</th>
              <th>LATITUDE</th>
              <th>LONGITUDE</th>
              <th>ZONE</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>{n.lat.toFixed(4)}</td>
                <td>{n.lng.toFixed(4)}</td>
                <td>{n.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
