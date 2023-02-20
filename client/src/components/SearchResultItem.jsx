import IssueItem from './IssueItem'
import BookItem from './BookItem'
export default function SearchResultItem(props) {
    return (
        <>
            {props.info.issueTitle ?
                (<IssueItem issueInfo={props.info} />)
                :
                (<BookItem bookInfo={props.info}/>)
            }
        </>
    )
}
