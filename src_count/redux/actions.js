/* 
用来创建actions 
actions是对象形式，记录type和data，由dispatch函数交给reducer一起处理
*/
import { INCREMENT, DECREMENT } from './action-types'


// 加法的action，返回的是对象
export const increment = (data) => {
    return {
        type: INCREMENT,
        data
    }
}

// 减法的action，返回的是对象
export const decrement = data => ({ type: DECREMENT, data })

// thunk的异步action,异步的返回的是dispach函数，同步的是返回的对象
export const incrementAsync = data => {
    return dispatch => {
        //函数里面可以执行异步代码，定时器，ajax请求，promise
        setTimeout(() => {
            // 当异步任务执行完毕的时候，发布同步action，一般是在已经写好的同步里面拿过来
            dispatch(increment(data))
        }, 1000);
    }
}

//user的action
export const changeUser = data => ({ type: 'changeUser', data })
