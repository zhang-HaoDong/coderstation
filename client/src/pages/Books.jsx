import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getBooksByPage, updateBookInfo } from '../api/book'
import PageHeader from '../components/PageHeader';
import TypeSelect from '../components/TypeSelect';
import { Card, Pagination } from 'antd'
import styles from '../css/Books.module.css'
import { useSelector } from 'react-redux';
export default function Books() {
  // 首先拿到书籍数据
  //分页信息
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [bookInfo, setBookInfo] = useState([])
  const navigate = useNavigate()
  //获取当前分类的信息
  const { bookTypeId } = useSelector(state => state.type);
  useEffect(() => {
    //获取书籍数据
    (async () => {
      //{currentPage: 1, eachPage: 10, count: 19, totalPage: 2, data: Array(10)}
      const params = {
        current,
        pageSize
      }
      if (bookTypeId !== 'all') {
        //说明书籍需分类获取
        params.typeId = bookTypeId;
        setCurrent(1)
      }
      const { data } = await getBooksByPage(params);
      setBookInfo(data.data);
      setTotal(data.count)
    })()
  }, [bookTypeId, current, pageSize])

  function pageChange(page) {
    setCurrent(page)
  }

  function handleClick(id, scanNumber) {
    //点击进入详情以后的事情
    //更新浏览记录
    updateBookInfo(id, {
      scanNumber: scanNumber + 1
    })
    //跳转到书籍详情页
    navigate(`/books/${id}`);
  }

  const bookList = bookInfo.map((item, index) => (
    <Card
      hoverable
      style={{
        width: 200,
        marginBottom: 30,
        marginRight: index % 5 === 4 ? 0 : 20
      }}
      cover={<img alt="example" style={{
        width: 160,
        height: 200,
        margin: 'auto',
        marginTop: 10
      }} src={item.bookPic} />}
      key={item._id}
      onClick={() => {
        handleClick(item._id, item.scanNumber)
      }}
    >
      <Card.Meta title={item.bookTitle} />
      <div className={styles.numberContainer}>
        <div>浏览数：{item.scanNumber}</div>
        <div>评论数：{item.commentNumber}</div>
      </div>
    </Card>
  ))
  return (
    <>
      <PageHeader title='书籍列表' >
        <TypeSelect></TypeSelect>
      </PageHeader>
      <div className={styles.bookContainer}>
        {bookList.length > 0 ? bookList : <div className={styles.noBook}>更多书籍 尽在Code Station</div>}
        <div className="paginationContainer">
          <Pagination defaultCurrent={1} total={total} current={current} pageSize={pageSize} hideOnSinglePage showSizeChanger={false} onChange={pageChange} />
        </div>
      </div>

    </>
  )
}
