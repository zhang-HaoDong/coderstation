/* eslint-disable no-restricted-globals */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTypeList, updateBookTypeId, updateIssueTypeId } from '../redux/typeSlice'
import { Tag } from 'antd'
export default function TypeSelect() {
    const dispatch = useDispatch()
    const { typeList } = useSelector(state => state.type);
    const [typeSelectList, setTypeSelectList] = useState([])
    // 颜色数组
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];
    function handleClick(typeId) {
        //更新状态仓库的数据
        // 问答
        if (location.pathname === '/') {
            dispatch(updateIssueTypeId(typeId))
        }
        // 数据
        if (location.pathname === '/books') {
            dispatch(updateBookTypeId(typeId))
        }
    }
    useEffect(() => {
        if (!typeList?.length) {
            // 类型列表不存在
            dispatch(getTypeList())
        }
        if (typeList?.length) {
            // 类型列表存在
            const typeSelectListArr = [];
            typeSelectListArr.push(<Tag
                color='magenta'
                value='all'
                key='all'
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick('all')}
            >全部</Tag>)
            typeList.forEach((item, index) => typeSelectListArr.push(<Tag
                color={colorArr[index % colorArr.length]}
                value={item._id}
                key={item._id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick(item._id)}
            >{item.typeName}</Tag>))
            setTypeSelectList(typeSelectListArr)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeList])
    return (
        <div>
            {typeSelectList}
        </div>
    )
}
