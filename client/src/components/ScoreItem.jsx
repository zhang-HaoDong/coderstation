import React from 'react'
import {useState} from 'react'
import styles from '../css/ScoreItem.module.css'
import {Avatar} from 'antd'
import classname from 'classnames'
export default function ScoreItem(props) {
    const [classCollection] = useState({
        'iconfont' : true,
        'icon-jiangbei' : true,
    })

    let rankNum = null;
    switch (props.rank){
        case 1:{
            rankNum = (
                <div style={{
                    color: '#ffda23',
                    fontSize: '22px'
                }} className={classname(classCollection)}></div>
            )
            break;
        }
        case 2:{
            rankNum = (
                <div style={{
                    color: '#c5c5c5',
                    fontSize: '22px'
                }} className={classname(classCollection)}></div>
            )
            break;
        }
        case 3:{
            rankNum = (
                <div style={{
                    color: '#cd9a62',
                    fontSize: '22px'
                }} className={classname(classCollection)}></div>
            )
            break;
        }
        default:{
            rankNum = (
                <div className={styles.rank}>{props.rank}</div>
            )
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                {rankNum}
                <div className={styles.avatar}>
                    <Avatar size="small" src={props.rankInfo.avatar} />
                </div>
                <div className={styles.nickname}>{props.rankInfo.nickname}</div>
            </div>
            <div className={styles.right}>{props.rankInfo.points}</div>
        </div>
    )
}
