/*  
reducer是处理数据的函数，会把由dispatch传过来的data(旧state)根据type进行相应的处理
根据type进行switch，返回的是处理后的state(新state)

reducer会传给createStore，进行创建store，其他地方不传
*/
import { INCREMENT, DECREMENT } from './action-types'
// 整合多个reducer
import { combineReducers } from 'redux'

//user的reducer
function user(state = 'initUser', action) {
    console.log(state, action);
    switch (action.type) {
        case 'changeUser':
            return action.data
        default: 
        return state
    }
}

// count的reducer
// 两个参数的顺序不能换
function count(state = 1, action) {
    console.log(state, action);
    switch (action.type) {
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}


/* 
    参数是包含所有需要整合的reducer函数对象，返回一个新的总的reducer,接收的参数也是state和action
    包含的state形式是总的state
    {
        count:1,
        user:{}
    }
*/
export default combineReducers({
    user,
    count,
})
