import React from 'react'
import { useEffect, useState } from 'react'
import { getUserByPointsRank } from '../api/user'
import ScoreItem from './ScoreItem'
import {Card} from 'antd'
export default function ScoreRank() {
    //存储用户排名信息
    const [userRankInfo, setUserRankInfo] = useState([])
    useEffect(() => {
        (async () => {
            const { data } = await getUserByPointsRank();
            setUserRankInfo(data)
        })()
    }, [])
    const userRank = userRankInfo?.map((item,index) => <ScoreItem key={item._id} rank={index+1} rankInfo={item}></ScoreItem>)
    return (
        <Card title='积分项目'>
            {userRank}
        </Card>
    )
}
