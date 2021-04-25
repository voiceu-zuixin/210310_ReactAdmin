/* 
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

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

const BASE = ''
//引入到login里了
export function reqLogin(username, password) {
    return ajax('./login', { username, password }, 'POST')
}

// 添加用户    没有的时候，先查看后端代码，看看哪个地址和方式，可以用postman先创建一个用户
export function reqAddUser(user) {
    return ajax('/manage/user/add', user, 'POST')
}

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => {
    return ajax(BASE + '/manage/category/list', { parentId })
}
// 添加分类
export const reqAddCategorys = (categoryName, parentId) => {
    return ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
}
// 更新分类
export const reqUpdateCategorys = (categoryId, categoryName) => {
    return ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')
}
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => {
    return ajax(BASE + '/manage/product/list', { pageNum, pageSize })
}
// 添加商品、或修改商品
export const reqAddOrUpdateProduct = (product) => {
    return ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
}

// 添加/修改商品
// export const reqAddOrUpdateProduct = (product) => ajax(BASE + 'manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 修改商品
// export const reqUpdateProduct = (product)=>{
//     return ajax(BASE+'manage/product/update'.product,'POST')
// }

// 搜索商品分页列表
// searchType：搜索的类型，productName/productDesc，用[]表示变量的方式
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => {
    return ajax(BASE + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchName,
    })
}

// 删除照片接口,就算传进一个非对象形式参数，也要在第二个参数中添加中括号变成对象
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')


//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole =(roleName)=> ajax(BASE+ '/manage/role/add',{roleName},'POST')

// 更新角色
export const reqUpdateRole =(role)=> ajax(BASE+ '/manage/role/update',role,'POST')

/* 
json请求的接口请求函数
*/
export const reqWeather = () => {
    return new Promise((resolve, reject) => {
        const url = "https://wis.qq.com/weather/common?source=pc&weather_type=observe%7Cforecast_1h%7Cforecast_24h%7Cindex%7Calarm%7Climit%7Ctips%7Crise&province=江苏省&city=徐州市"
        jsonp(url, {}, (err, data) => {
            // console.log(err, data);
            if (!err && data.message === 'OK') {
                //取出需要的数据  ,解构赋值的形式不好用，这里层次太多了
                // data.data.forecast_1h.0.weather
                const weatherData = data.data.forecast_1h[0].weather
                // console.log(data.data.forecast_1h[0].weather);
                message.success('成功获取天气')
                resolve(weatherData)

            } else {
                //如果失败了
                message.error('获取天气信息失败')
            }
        })
    })
}
export const reqWeatherPic = () => {
    return new Promise((resolve, reject) => {

        const url = "https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/day/01.png"
        jsonp(url, {}, (err, data) => {
            // console.log(data);
            // resolve(data)
        })
    })
}