import React from 'react';

const LegendCategorical = (props: any) => {
  // Get the number of entries to calculate block width
  const colorMapping: { [key: string]: string } = props.colorMapping ;
  const width = props.width ;
  const height = 50 ;
  const title = props.title ;
  const numValues = Object.keys(colorMapping).length;
  const blockWidth = width / numValues;

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      {/* Title */}
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>{title}</div>

      {/* Color Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {Object.entries(colorMapping).map(([value, color], index) => (
            <div key={index} style={{ width: blockWidth, textAlign: 'center' }}>
              <div style={{ backgroundColor: color, height: height, width: '100%' }}></div>
            </div>
          ))}
        </div>

        {/* Value Labels */}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {Object.entries(colorMapping).map(([value], index) => (
            <div key={index} style={{ width: blockWidth, textAlign: 'center' }}>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegendCategorical;
