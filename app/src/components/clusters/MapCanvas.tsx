import React, { useRef, useEffect } from 'react';


const MapCanvas = (props: any) => {

  const { dots, clusterBorders, width, height, hoveredCluster, setHoveredCluster, setSelectedCluster, hoveredDot, setHoveredDot } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    ctx.clearRect(0, 0, width, height);
    dots.forEach((row: any) => {
      const x = row.x ;
      const y = row.y ;
      const color = row.c;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  useEffect(() => {
    drawCanvas();
  }); 

  const renderCanvas = () => {
    return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
  }

  const renderClusterBorders = () => {
    return (
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {clusterBorders.map((cluster: any) => {
          const points = cluster.hull.map((point: any) => (`${point.x},${point.y}`)).join(' ');
          return (
            <polygon
              key={cluster.id}
              points={points}
              fill={hoveredCluster === cluster.id ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0)'}
              stroke='rgba(128, 128, 128, 0.5)'
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredCluster(cluster.id)}
              onMouseLeave={() => setHoveredCluster(null)}
              onClick={() => setSelectedCluster(cluster.id)}
            />
          );
        })}
      </svg>
    ) ;
  }

  const renderDotBorders = () => {
    if (clusterBorders && clusterBorders.length > 0) return null ;
    return (
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {dots.map((dot: any, index: number) => {
          return (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={5}
              fill={hoveredDot === dot.fid ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0)'}
              stroke='white'
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredDot(dot.fid)}
              onMouseLeave={() => setHoveredDot(null)}
            />
          );
        })}
      </svg>
    ) ;
  }

  return (
    <div style={{ position: 'relative', width: width+'px', height: height+'px', marginTop: '25px', marginBottom: '25px' }}>
      {renderCanvas()}
      {renderClusterBorders()}
      {renderDotBorders()}
    </div>
  );
};

export default MapCanvas;
