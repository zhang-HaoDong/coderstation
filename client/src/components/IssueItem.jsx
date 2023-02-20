import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Tag } from 'antd'
import { formatDate } from '../utils/tools'
import { getTypeList } from '../redux/typeSlice'
import { getUserByID } from '../api/user'
import {updateIssueInfo} from '../api/issue'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../css/IssueItem.module.css'


export default function IssueItem(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState({});
  const { typeList } = useSelector(state => state.type);
  // 颜色数组
  const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
  // 寻找该文章的type
  const type = typeList.find(item => item._id === props.issueInfo.typeId);
  //获取type列表
  useEffect(() => {
    if (typeList.length !== 0) return;
    dispatch(getTypeList())
  }, [dispatch, typeList.length])
  // 获取用户信息
  useEffect(() => {
    (async () => {
      const { data } = await getUserByID(props.issueInfo.userId);
      setUserInfo(data)
    })()
  }, [props.issueInfo.userId])

  function enterToIssueDetail() {
    updateIssueInfo(props.issueInfo._id,{
      scanNumber:++props.issueInfo.scanNumber
    })
    navigate(`/issues/${props.issueInfo._id}`);
  }

  return (
    <div className={styles.container}>
      {/* 回答数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.commentNumber}</div>
        <div>回答</div>
      </div>
      {/* 浏览数 */}
      <div className={styles.issueNum}>
        <div>{props.issueInfo.scanNumber}</div>
        <div>浏览</div>
      </div>
      {/* 问题内容 */}
      <div className={styles.issueContainer}>
        <div className={styles.top}
          onClick={enterToIssueDetail}
        >
          {props.issueInfo.issueTitle}
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
          </div>
          <div className={styles.right}>
            <Tag color="volcano">{userInfo?.nickname}</Tag>
            <span>{formatDate(props.issueInfo.issueDate, "year")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
