import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PageHeader from '../components/PageHeader'
import IssueItem from '../components/IssueItem'
import AddIssueBtn from '../components/AddIssueBtn'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import TypeSelect from '../components/TypeSelect'
import { getIssuesByPage } from '../api/issue'
import styles from '../css/Issue.module.css'
import { Pagination } from 'antd'
export default function Issues() {
  // 用于存储获取到的问题列表
  const [issueInfo, setIssueInfo] = useState([])
  // 获取类型 id
  const { issueTypeId } = useSelector(state => state.type)
  // 分页信息
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const params = {
      current: current,
      pageSize: pageSize,
      issueStatus: true
    }
    if (issueTypeId !== 'all') {
      params.typeId = issueTypeId;
      setCurrent(1)
    }
    (async () => {
      const { data } = await getIssuesByPage(params)
      setTotal(data?.count)
      setIssueInfo(data.data);
    })()
  }, [current, pageSize, issueTypeId])

  // 页码放生变化后
  function onChange(page, pageSize) {
    setCurrent(page);
  }

  //获取问答列表
  const issueList = issueInfo.map(item => <IssueItem key={item._id} issueInfo={item} />);

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <PageHeader title='问答列表' >
        <TypeSelect></TypeSelect>
      </PageHeader>
      {/* 列表内容区域 */}
      <div className={styles.issueContainer}>
        {/* 左边区域 */}
        <div className={styles.leftSide}>
          {issueList}
          {
            issueInfo.length > 0 ?
              (<div className='paginationContainer'><Pagination showSizeChanger={false} defaultCurrent={1} total={total} current={current} defaultPageSize={pageSize} hideOnSinglePage onChange={onChange} /></div>)
              :
              (<div className={styles.noIssue}>有问题 就来 Code Station</div>)
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
