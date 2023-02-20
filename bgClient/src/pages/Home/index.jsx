import { useEffect, useState } from 'react'
import { WordCloud } from '@ant-design/plots'
import { getTypes } from '../../services/type'
import { getBooksByPage } from '../../services/book'
import { getInterview } from '../../services/interview'
const HomePage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const typesData = await getTypes();
      const booksData = await getBooksByPage({
        current: 1,
        pageSize: 50
      })
      const interviewData = await getInterview();
      typesData.data.forEach(item => {
        item.value = 1
        item.wordCloud = item.typeName
      })
      booksData.data.data.forEach(item => {
        item.value = 1
        item.wordCloud = item.bookTitle
      })
      interviewData.data.data.forEach(item => {
        item.value = 1
        item.wordCloud = item.interviewTitle.slice(0, 5) + '···'
      })
      const newData = [...typesData.data, ...booksData.data.data, ...interviewData.data.data];

      setData(newData)
    })()
  }, []);

  const config = {
    data,
    height: 550,
    wordField: 'wordCloud',
    weightField: 'value',
    colorField: 'wordCloud',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [16, 32],
      rotation: 10,
    },
    color: ['#CC3299', '#007FFF', '#FF2400', ' #00009C', ' #E47833', ' #8E2323'],
  };
  return <div style={{
    paddingTop:100,
  }}>
    <WordCloud {...config} />
  </div>;
};

export default HomePage;
