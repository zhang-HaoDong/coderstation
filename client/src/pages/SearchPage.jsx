import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import PageHeader from '../components/PageHeader';
import AddIssueBtn from '../components/AddIssueBtn';
import Recommend from '../components/Recommend';
import ScoreRank from '../components/ScoreRank'
import SearchResultItem from '../components/SearchResultItem'
import BookItem from '../components/BookItem';
import { getIssuesByPage } from '../api/issue';
import { getBooksByPage } from '../api/book'
import { Pagination } from 'antd'
import styles from '../css/SearchPage.module.css'

export default function SearchPage() {
  //{value: '123', searchOption: 'issue'}
  const { state } = useLocation();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [searchInfo, setSearchInfo] = useState([])

  function onChange(page) {
    setCurrent(page)
  }
  useEffect(() => {
    (async () => {
      if (state.searchOption === 'issue') {
        let params = {
          current,
          pageSize,
          issueTitle: state.value
        }
        // {currentPage: 1, eachPage: 10, count: 2, totalPage: 1, data: Array(2)}
        const { data } = await getIssuesByPage(params);
        setTotal(data.count);
        setSearchInfo(data.data)
      }
      if (state.searchOption === 'book') {
        // 搜索数据
        let params = {
          current,
          pageSize,
          bookTitle: state.value
        }
        const { data } = await getBooksByPage(params)
        setTotal(data.count);
        setSearchInfo(data.data);
      }
    })()
    return ()=>{
      setSearchInfo([])
    }
  }, [current, pageSize, state])
  let searchList = null;
  if (state.searchOption === 'issue') {
    searchList = searchInfo.map(item => <SearchResultItem key={item._id} info={item} />)
  }
  if (state.searchOption === 'book') {
    searchList = searchInfo.map(item => <BookItem key={item._id} info={item} />)
  }
  return (
    <div className='container'>
      {/* 头部 */}
      <PageHeader title='搜索结果' />
      {/* 列表内容区域 */}
      <div className={styles.searchPageContainer}>
        {/* 左边区域 */}
        <div className={styles.leftSide}>
          {searchList}
          {
            searchInfo.length > 0 ?
              (<div className='paginationContainer'><Pagination showSizeChanger={false} defaultCurrent={1} total={total} current={current} defaultPageSize={pageSize} hideOnSinglePage onChange={onChange} /></div>)
              :
              (<div className={styles.noResult}>无搜索结果</div>)
          }
        </div>
        {/* 右边区域 */}
        <div className={styles.rightSide}>
          <AddIssueBtn></AddIssueBtn>
          <Recommend></Recommend>
          <ScoreRank></ScoreRank>
        </div>
      </div>
    </div>
  )
}
