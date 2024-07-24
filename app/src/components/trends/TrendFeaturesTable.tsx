import React from 'react';
import 'chart.js/auto';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getColorForArray, deepCopy } from '../../utils';


const tableHeaderStyle = {
  fontWeight: 'bold',
} ;

class TrendFeaturesTable extends React.Component<{ items: string[], data: any }> {

  prepareData() {
    const keys= [
      'num_casts',
      'num_fids',
      'num_follower',
      'num_following',
      'num_like',
      'num_recast',
      'num_reply',
      'predict_like',
      'q_funny',
      'q_happiness',
      'q_info',
    ] ;

    const headers: any = {
      'num_casts': 'Casts',
      'num_fids': 'U.FIDs',
      'num_follower': 'Followers',
      'num_following': 'Following',
      'num_like': 'Likes',
      'num_recast': 'Recasts',
      'num_reply': 'Replies',
      'predict_like': 'Quality',
      'q_funny': 'Funny',
      'q_happiness': 'Happy',
      'q_info': 'Info'
    } ;
    const lightColorsArray = getColorForArray('light', this.props.items.length) ;
    const rows = [] ;
    for (let i=0; i<this.props.items.length; i++) {
      try {
        const item = this.props.items[i] ;
        const num = Number(this.props.data[item].data.global.num_casts) ;
        const fids = Number(this.props.data[item].data.global.num_fids) ;
        if ( num > 0 && fids > 0) {
          const itemData = deepCopy(this.props.data[item].data.global) ;
          itemData.item = item ;
          itemData.color = lightColorsArray[i] ;
          rows.push(itemData) ;
        }
      } catch (e) {}
    }
    return {
      keys,
      headers,
      rows
     } ;
  }

  formatNumber(value: any) {
    try {
      return Number(value).toFixed(2) ;
    } catch (e) {
      return value ;
    }
  }

  render() {
    const {keys, headers, rows} = this.prepareData() ;
    return (
      <div style={{ width: '100%', overflowX: 'scroll' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={tableHeaderStyle}>Item</TableCell>
                  {keys.map((k) => (
                    <TableCell key={k} style={tableHeaderStyle}>
                      {headers[k]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell style={{color: row.color, fontWeight: 'bold'}}>{row.item}</TableCell>
                    {keys.map((k) => (
                      <TableCell key={k} align="right">{this.formatNumber(row[k])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </TableContainer>
      </div>
    );
  }

}

export default TrendFeaturesTable ;