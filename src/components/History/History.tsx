import React from 'react'
import './History.scss'

interface HistoryProps {
  historyList: string[];
  onHistoryClick: (city: string) => void;
}
const History: React.FC<HistoryProps> = ({ historyList, onHistoryClick }: any) => {
  return (
    <div className='history'>
      <h3>Search History</h3>
      <ul>
        {historyList.map((item: string, index: number) => (
          <li key={index} onClick={() => onHistoryClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default History
