import React from 'react';
import WordCloud from 'react-d3-cloud';
import Panel from '../common/Panel'; 
import { parseWordDict } from '../../utils' ;


class UserWordCloud extends React.Component< {data: any}> {
  
  render() {
    const data = this.props.data ;
    if (!data && !data.features) {
      return null ;
    }
    const words = parseWordDict(data.features.words_dict, 15, 150)  ;
    if (!words) {
      return null ;
    }
    return (
      <Panel title="Word Cloud">
        <WordCloud data={words}
                   width={500} 
                   height={500} 
                   fontSize={(word)=>word.value}
                   rotate={(word)=>0}
                   padding={4}
        />
      </Panel>
    );
  }

}

export default UserWordCloud;