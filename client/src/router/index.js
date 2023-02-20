import Issues from '../pages/Issues'
import Books from '../pages/Books'
import BookDetail from '../pages/BookDetail'
import Interviews from '../pages/Interviews'
import AddIssue from '../pages/AddIssue'
import IssueDetail from '../pages/IssueDetail'
import SearchPage from '../pages/SearchPage'
import Personal from '../pages/Personal'
import { Navigate, Route, Routes } from 'react-router-dom'

function RouteConfig() {
    return <Routes>
        <Route path='/' element={<Issues />} />
        <Route path='/issues' element={<Navigate to='/' />} />
        <Route path='/issues/:id' element={<IssueDetail />} />
        <Route path='/addissue' element={<AddIssue />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/:id' element={<BookDetail />} />
        <Route path='/interviews' element={<Interviews />} />
        <Route path='/searchpage' element={<SearchPage />} />
        <Route path='/personal' element={<Personal />} />
    </Routes>
}
export default RouteConfig;