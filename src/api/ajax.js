/* 
    能发送异步ajax请求的函数模块
    封装axios库
    函数返回值是promise对象

    1、优化：统一处理请求异常
        在外部包一个自己创建的promise对象
        在请求出错的时候，不reject(error),而是直接显示错误提示
    2、优化2：异步成功后得到的response直接取data，然后往上传
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {//这个叫形参默认值

    //本身就是return一个promise对象，在这里进行集中处理，因为都会经过这里
    // 新建一个promise对象，对于没有异常的，直接成功回调网上传出去，对于失败的就进行处理了
    return new Promise((reslove, reject) => {
        let promise
        //1、执行异步ajax请求
        if (type === 'GET') {//发送GET请求
            promise = axios.get(url, { params: data })
        } else {//发送POST请求
            promise = axios.post(url, data)
        }
        //2、如果成功了，调用resolve
        promise.then((res) => {
            reslove(res.data)
        })
            // 3.如果失败了，不调用reject，而是提示异常信息
            .catch(err => {
                message.error('出错了' + err.message)
            })
    })


}