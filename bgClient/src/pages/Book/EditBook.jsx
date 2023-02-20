import { useEffect, useState } from 'react'
import { useParams,useNavigate } from '@umijs/max'
import { PageContainer } from '@ant-design/pro-components'
import { getBookById, updateBook } from '../../services/book'
import BookForm from './component/BookForm'
import { message } from 'antd'
export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 书籍信息
  const [bookInfo, setbookInfo] = useState({})
  useEffect(() => {
    // 获取书籍的信息
    (async () => {
      const { data } = await getBookById(id)
      setbookInfo(data)
    })()
  }, [])
  function onsubmit(editorVal) {
    updateBook(id,{
      ...bookInfo,
      bookIntro:editorVal
    })
    message.success('修改书籍信息成功');
    navigate('/book/booklist')
  }
  return (
    <>
      <PageContainer>
        <BookForm
          bookInfo={bookInfo}
          setBookInfo={setbookInfo}
          type='edit'
          onsubmit={onsubmit}
        />
      </PageContainer>
    </>
  )
}
