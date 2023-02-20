import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getIssueCommentById, addComment, getBookCommentById } from '../api/comment'
import { getUserByID } from '../api/user'
import { updateIssueInfo } from '../api/issue'
import { updateBookInfo } from '../api/book'
import { updateUser } from '../redux/userSlice'
import { formatDate } from '../utils/tools'

import { Avatar, Comment, Form, Button, List, Tooltip, Pagination, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import styles from '../css/Discuss.module.css'
export default function Discuss(props) {
    const { isLogin, userInfo } = useSelector(res => res.user);
    const [commentList, setCommentList] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [refresh, setRefresh] = useState(false);
    const editorRef = useRef()
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchCommentList() {
            let data = null;
            // 根据该问答或者书籍 id 获取对应的评论
            if (props.commentType === 1) {
                // 传递过来的是问答 id
                const result = await getIssueCommentById(props.targetId, {
                    current: current,
                    pageSize: pageSize
                });
                data = result.data;
            } else if (props.commentType === 2) {
                // 传递过来的是书籍 id
                const result = await getBookCommentById(props.targetId, {
                    current: current,
                    pageSize: pageSize
                });
                data = result.data;
            }

            // 获取每条评论对应的用户信息
            for (let i = 0; i < data.data.length; i++) {
                const result = await getUserByID(data.data[i].userId);
                data.data[i].userInfo = result.data;
            }
            setCommentList(data.data);
            setTotal(data.count)
        }
        if (props.targetId) {
            fetchCommentList();
        }
    }, [current, pageSize, props.commentType, props.targetId, refresh]);


    let avatar = null;
    if (isLogin) {
        avatar = <Avatar src={userInfo?.avatar} />
    } else {
        avatar = <Avatar icon={<UserOutlined />} />
    }
    //页码改变事件
    function onChange(page) {
        setCurrent(page);
    }
    // 评论提交事件
    function onSubmit() {
        let comment = null;
        if (props.commentType === 1) {
            //问答评论
            comment = editorRef.current.getInstance().getHTML();
            if (comment === '<p><br></p>') {
                message.warning('请输入评论');
                return;
            }
        } else if (props.commentType === 2) {
            //书籍评论
            comment = editorRef.current.getInstance().getHTML();
            if (comment === '<p><br></p>') {
                message.warning('请输入评论');
                return;
            }
        }
        // 提交评论
        addComment({
            userId: userInfo._id,
            typeId: props.commentType === 1 ? props.issueInfo.typeId : props.bookInfo.typeId,
            commentContent: comment,
            commentType: props.commentType,
            bookId: props.commentType === 1 ? null : props.targetId,
            issueId: props.commentType === 1 ? props.targetId : null
        })
        //刷新评论列表
        setRefresh(!refresh)
        if (props.commentType === 1) {
            //问答
            //清空文本框数据
            editorRef.current.getInstance().setHTML()
            //更新当前问答的评论数
            updateIssueInfo(props.targetId, {
                commentNumber: total + 1
            })
        } else if (props.commentType === 2) {
            //书籍
            //清空文本框数据
            editorRef.current.getInstance().setHTML()
            //更新书籍评论列表
            updateBookInfo(props.targetId, {
                commentNumber: total + 1
            })
        }
        //更新当前用户的积分
        dispatch(updateUser({
            userId: userInfo._id,
            newInfo: {
                points: userInfo.points + 4
            }
        }))
        message.success('评论成功,用户积分 +4 分')
    }

    return (
        <div>
            {/* 评论框 */}
            <Comment
                avatar={avatar}
                content={
                    <Form>
                        <Form.Item>
                            <Editor
                                ref={editorRef}
                                initialValue=""
                                previewStyle='vertical'
                                height='270px'
                                initialEditType='wysiwyg'
                                useCommandShortcut={true}
                                language='zh-CN'
                                className='editor'
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='button'
                                disabled={!isLogin}
                                onClick={onSubmit}
                            >
                                添加评论
                            </Button>
                        </Form.Item>
                    </Form>
                }
            />
            {/* 评论列表 */}
            {
                commentList?.length > 0
                &&
                <List
                    dataSource={commentList}
                    header="当前评论"
                    itemLayout="horizontal"
                    renderItem={function (props) {
                        return (
                            <Comment
                                avatar={props.userInfo?.avatar?<Avatar src={props.userInfo?.avatar} />:<Avatar icon={<UserOutlined />} />}
                                author={props.userInfo?.nickname || '该用户已注销'}
                                content={
                                    <div
                                        dangerouslySetInnerHTML={{ __html: props.commentContent }}
                                    ></div>
                                }
                                datetime={
                                    <Tooltip title={formatDate(props.commentDate)}>
                                        <span>{formatDate(props.commentDate, 'year')}</span>
                                    </Tooltip>
                                }
                            />
                        )
                    }}
                />
            }
            {/* 分页 */}
            {
                commentList?.length > 0 ? (
                    <div className={styles.paginationContainer}>
                        <Pagination
                            defaultCurrent={1}
                            current={current}
                            pageSize={pageSize}
                            total={total}
                            onChange={onChange}
                            hideOnSinglePage
                            showSizeChanger={false}
                        />
                    </div>
                ) : (
                    <div style={{
                        fontWeight: "200",
                        textAlign: "center",
                        margin: "50px"
                    }}
                    >暂无评论</div>
                )
            }
        </div>
    )
}
