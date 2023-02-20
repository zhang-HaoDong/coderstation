import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import BookForm from './component/BookForm'
import { addBook } from '../../services/book'
import { message } from 'antd';
import { useNavigate } from '@umijs/max'
export default function AddBook() {
  // 新增书籍的信息
  const [bookInfo, setbookInfo] = useState({});
  const navigate = useNavigate()
  // 提交新增书籍请求
  function onsubmit(editorVal) {
      addBook({
        ...bookInfo,
        bookIntro:editorVal
      })
      message.success('添加书籍成功');
      navigate('/book/booklist')
  }
  return (
    <>
      <PageContainer>
        <div style={{ width: 800 }}>
          <BookForm
            type='add'
            bookInfo={bookInfo}
            setBookInfo={setbookInfo}
            onsubmit={onsubmit}
          />
        </div>
      </PageContainer>
    </>
  )
}
