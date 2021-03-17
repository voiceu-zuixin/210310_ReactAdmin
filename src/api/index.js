/* 
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'

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

/* 
json请求的接口请求函数
*/
export const reqWeather = () => {
    const url = "https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cindex%7Calarm%7Climit%7Ctips%7Crise&province=江苏省&city=徐州市"
    jsonp(url, {}, (err, data) => {
        console.log(err, data);
    })
}
reqWeather()