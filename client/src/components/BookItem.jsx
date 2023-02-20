import React from 'react';
import { Image } from "antd"
import {useNavigate} from 'react-router-dom'
import styles from "../css/BookItem.module.css";

function BookItem(props) {
    const navigate = useNavigate();
    const reg = /<[^<>]+>/g;
    const bookIntro = props.info?.bookIntro?.replace(reg,"");
    return (
        <div className={styles.container}>
            {/* 评论数 */}
            <div className={styles.bookNum}>
                <div>{props.info?.commentNumber}</div>
                <div>评论</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.bookNum}>
                <div>{props.info?.scanNumber}</div>
                <div>浏览</div>
            </div>
            {/* 书籍内容 */}
            <div className={styles.bookContainer}>
                {/* 左边图片 */}
                <div className={styles.left}>
                    <Image className={styles.bookPic} src={props.info?.bookPic} />
                </div>
                {/* 右侧分为上下 */}
                <div className={styles.right}>
                    <div className={styles.top} onClick={() => navigate(`/book/${props.info?._id}`)}>{props.info?.bookTitle}</div>
                    <div className={styles.bottom}>{bookIntro?.slice(0,55) + "..."}</div>
                </div>
            </div>
        </div>
    );
}

export default BookItem;