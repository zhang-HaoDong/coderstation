import React from 'react'
import styles from '../css/PageHeader.module.css'

export default function PageHeader(props) {
  return (
    <div className={styles.row}>
      {/* 标题 */}
      <div className={styles.pageHeader}>
        {props.title}
      </div>
      {/* 标签选择器 */}
      {props.children}
    </div>
  )
}
