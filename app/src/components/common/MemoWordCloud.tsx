import { memo } from 'react';
import WordCloud from 'react-d3-cloud';


const MemoWordCloud = memo((props:any) => {
  const { data, width, height, fontSize, rotate, padding } = props;
  return (
    <WordCloud
      data={data}
      width={width}
      height={height}
      fontSize={fontSize}
      rotate={rotate}
      padding={padding}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.fid === nextProps.fid;
});

export default MemoWordCloud ;