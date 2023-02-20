import { useState, useEffect } from 'react'
import Discuss from '../components/Discuss'
import PageHeader from '../components/PageHeader'
import { Image, Modal, message } from 'antd'

import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlice'
import { getBookById } from '../api/book'
import styles from '../css/BookDetail.module.css'
export default function BookDetail() {
    // 获取书籍id
    const { id } = useParams();
    const dispatch = useDispatch()
    const [bookInfo, setBookInfo] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { isLogin, userInfo } = useSelector(state => state.user);

    //提示框取消操作
    function handleCancel() {
        setIsModalOpen(false)
    }
    //提示框确定操作
    function handleOk() {
        if (userInfo.points - bookInfo.requirePoints < 0) {
            message.warning("积分不足");
        } else {
            // 积分是够的 
            // 本地仓库服务器扣除积分
            dispatch(updateUser({
                userId: userInfo._id,
                newInfo: { points: userInfo.points - bookInfo.requirePoints, }
            }))
            window.open(`${bookInfo.downloadLink}`);
            message.success("积分已扣除");
        }
        handleCancel()
    }
    //展开提示框
    function showModal() {
        setIsModalOpen(true);
    }
    //根据id查询书籍的信息
    useEffect(() => {
        (async () => {
            const { data } = await getBookById(id);
            setBookInfo(data)
        })()
    }, [id])
    return (
        <div>
            <PageHeader title="书籍详情" />
            <div className={styles.bookInfoContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.img}>
                        <Image
                            height={350}
                            src={bookInfo?.bookPic}
                        />
                    </div>
                    <div className={styles.link}>
                        <span>下载所需积分: <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span> 分</span>
                        {
                            isLogin ? (
                                <div className={styles.downloadLink} onClick={showModal}>
                                    百度云下载地址
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <h1 className={styles.title}>{bookInfo?.bookTitle}</h1>
                    <div dangerouslySetInnerHTML={{ __html: bookInfo?.bookIntro }}></div>
                </div>
            </div>
            <div className={styles.comment}>
                <Discuss
                    bookInfo={bookInfo}
                    commentType={2}
                    targetId={bookInfo?._id}
                />
            </div>
            <Modal title="重要提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>是否使用 <span className={styles.requirePoints}>{bookInfo?.requirePoints}</span> 积分下载此书籍？</p>
            </Modal>
        </div>
    );
}