/* 
通过createStore创建store
*/
import { createStore ,applyMiddleware} from 'redux'
import reducer from './reducers'
// 引入thunk来进行redux的异步处理，redux默认不支持异步，同时要在redux中一如applyMiddleware
// 用法是在createStore的第二个参数里写applyMiddleware(xxx)，xxx为插件、中间件，此处为thunk
import thunk from 'redux-thunk'

// 要想使用redux管理工具，需要下载redux-devtools-extension,在--save-dev，或者--save里面，自己判断
// 然后引入
import {composeWithDevTools} from 'redux-devtools-extension'



// 1、不用中间件，最原始的写法
// export default createStore(reducer)

// 2、用中间件thunk，可以进行异步处理
// export default createStore(reducer,applyMiddleware(thunk))

// 3、使用redux-devtools工具，在包裹一层
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))
