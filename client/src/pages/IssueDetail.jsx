import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getIssueDetailByID } from '../api/issue'
import { getUserByID } from '../api/user'

import PageHeader from '../components/PageHeader'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import Discuss from '../components/Discuss'
import { formatDate } from '../utils/tools'
import styles from '../css/IssueDetail.module.css'

import { Avatar } from 'antd'
export default function IssueDetail() {
  // 获取文章的id
  const { id } = useParams();
  const [issueInfo, setIssueInfo] = useState({})
  const [issueUser, setIssueUser] = useState({})
  useEffect(() => {
    (async () => {
      const { data } = await getIssueDetailByID(id);
      setIssueInfo(data)
    })()
  }, [id])
  useEffect(() => {
    (async () => {
      if (issueInfo.userId) {
        const { data } = await getUserByID(issueInfo?.userId)
        setIssueUser(data)
      }
    })()
  }, [issueInfo?.userId])
  return (
    <div className={styles.container}>
      {/* 头部 */}
      <PageHeader title='问题详情' />
      {/* 列表内容区域 */}
      <div className={styles.detailContainer}>
        {/* 左边区域 */}
        <div className={styles.leftSide}>
          {/* 问答详情 */}
          <div className={styles.question}>
            <h1>{issueInfo?.issueTitle}</h1>
            <div className={styles.questioner}>
              <Avatar size="small" src={issueUser?.avatar} />
              <span className={styles.user}>{issueUser?.nickname}</span>
              <span>发布于：{formatDate(issueInfo?.issueDate)}</span>
            </div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}></div>
            </div>
          </div>
          {/* 评论 */}
          <Discuss
            commentType={1}
            targetId={issueInfo?._id}
            issueInfo={issueInfo}
          />
        </div>
        {/* 右边区域 */}
        <div className={styles.rightSide}>
          <Recommend></Recommend>
          <ScoreRank></ScoreRank>
        </div>
      </div>
    </div>
  )
}
