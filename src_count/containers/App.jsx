import Counter from '../components/Counter'
import { connect } from 'react-redux'
import { increment, decrement, incrementAsync, changeUser } from '../redux/actions'


function mapStateToProps(state) {
    return {
        count: state.count,
        user: state.user
    }
}

// function mapDispatchToProps(dispatch){
//     return {
//         increment: data =>dispatch(increment(data)),
//         decrement: data =>dispatch(decrement(data)),
//     }
// }
// 简写方式，是内部封装好了的，会把increment包装成increment: data =>dispatch(increment(data)),
// 传给Counter的props不是action而是dispatch,调用的时候是dispatch(action(state))
const mapDispatchToProps = { increment, decrement, incrementAsync, changeUser }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)