import React, { Component } from 'react'
// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/ye.jpg'

import { Link, withRouter } from 'react-router-dom'
import './index.less'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'



const { SubMenu } = Menu;
class LeftNav extends Component {

    // 判断当前登录用户对item是否有权限
    hasAuth = (itemObj) => {
        const { key, isPublic } = itemObj
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        // 1.如果当前用户是admin
        // 2.如果当前item是公开的
        // 3.如果当前用户有item权限，即key是否存在于menus里
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (itemObj.children) {
            // 4.如果当前用户有此item的某个字item的权限
            return !!itemObj.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    getMenuListNode = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map((itemObj) => {

            // 如果当前用户有item对应的权限，才显示对应的菜单项
            if (this.hasAuth(itemObj)) {

                if (itemObj.children) {
                    // 查找一个与当前请求路径匹配的子itemObj
                    const cItem = itemObj.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在，说明当前item的子列表需要被打开
                    if (cItem) this.openKey = itemObj.key
                    return (
                        <SubMenu key={itemObj.key} icon={itemObj.icon} title={itemObj.title}>
                            {/* <Link to={itemObj.key}>
                            </Link> */}
                            {this.getMenuListNode(itemObj.children)}
                        </SubMenu>
                    )
                } else {
                    return (
                        <Menu.Item key={itemObj.key} icon={itemObj.icon}>
                            <Link to={itemObj.key}>
                                {itemObj.title}
                            </Link>
                        </Menu.Item>
                    )
                }
            }else{
                return null
            }


        })
    }

    render() {
        const menu = this.getMenuListNode(menuList)
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) path = '/product' //如果是/product的子路由，也是选中目标的
        const openKey = this.openKey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>管理后台</h1>
                </Link>

                <div style={{ width: 200 }}>
                    <Menu
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >
                        {
                            menu
                        }

                    </Menu>
                </div>
            </div>
        )
    }
}
/* 
    withRouter高阶组件：
    包装非路由组件，返回一个新的组件
    新的组件向以前的非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)
