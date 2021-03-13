/* 
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
*/
import ajax from './ajax'

/*
    对于复合对象的导出，如果用export default会出现Assign object to a variable before exporting as module default的报错
    见https://blog.csdn.net/weixin_43654374/article/details/110457855
    https://zhuanlan.zhihu.com/p/40733281?utm_source=wechat_session
*/
// export default {
//     reqLogin(username,password){
//         return ajax('./login',{username,password},'POST')
//     },
//     reqAddUser(user){
//         return ajax('/manage/user/add',user,'POST')
//     }
// }

// const BASE =''
export function reqLogin(username, password) {
    return ajax('./login', { username, password }, 'POST')
}
export function reqAddUser(user) {
    return ajax('/manage/user/add', user, 'POST')
}