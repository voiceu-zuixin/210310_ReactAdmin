import React, { Component } from 'react'
// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/ye.jpg'

import { Link, withRouter } from 'react-router-dom'
import './index.less'
import { Menu} from 'antd';
import menuList from '../../config/menuConfig'
const { SubMenu } = Menu;
class LeftNav extends Component {
    
    getMenuListNode = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map((itemObj) => {
            if (itemObj.children) {
                // 查找一个与当前请求路径匹配的子itemObj
                const cItem = itemObj.children.find(cItem=>  path.indexOf(cItem.key)===0)
                // 如果存在，说明当前item的子列表需要被打开
                if(cItem) this.openKey = itemObj.key
                return (
                    <SubMenu key={itemObj.key} icon={itemObj.icon} title={itemObj.title}>
                        {/* <Link to={itemObj.key}>
                        </Link> */}
                            {this.getMenuListNode(itemObj.children)}
                    </SubMenu>
                )
            }else{
                return(
                    <Menu.Item key={itemObj.key} icon={itemObj.icon}>
                        <Link to={itemObj.key}>
                            {itemObj.title}
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }
    
    UNSAFE_componentWillMount(){

    }
    render() {
        const menu = this.getMenuListNode(menuList)
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0) path = '/product' //如果是/product的子路由，也是选中目标的
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
