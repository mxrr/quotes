import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts';

import paths from '../../utils/paths.json';
import LoadingComponent from '../LoadingComponent';
import './Timeout.css';

const reqPath = process.env.NODE_ENV === 'development' ? paths.devPath : paths.productionPath;

type arrContents = [string, number]

type ResponseType = [
  {
    name: string,
    timeouts: number,
    bans: number
  }
]

type DataType = {
  label: string,
  data: arrContents[]
}

function Timeout() {

  const [stats, setStats] = useState<DataType[]>();

  useEffect(() => {
    fetch(`${reqPath}tools/timeout`)
      .then(res => res.json())
      .then((json: ResponseType) => {
        const timeouts: DataType = {
          label: 'Timeouts',
          data: new Array<arrContents>()
        }
      
        const bans: DataType = {
          label: 'Bans',
          data: new Array<arrContents>()
        }
      
        json.forEach(el => {
          timeouts.data.push([el.name, el.timeouts]);
          bans.data.push([el.name, el.bans]);
        })
    
        setStats([timeouts, bans]);
      });
  }, []);
  
  return (
    <div className="timeoutChartContainer">
      <div
        className="timeoutChart"
        style={{
          position: 'relative',
          display: 'grid',
          top: '50px',
          margin: 'auto'
        }}
      >
        { !stats &&
          <h1><LoadingComponent margin="150px" /></h1>
        }

        { stats &&
          <Chart 
            data={stats} 
            series={{type: 'bar'}} 
            axes={[
              { primary: true, type: 'ordinal', position: 'bottom' },
              { type: 'linear', position: 'left' }
            ]} 
            tooltip 
            dark
          />
        }
        
      </div>
    </div>
  )
}

export default Timeout;