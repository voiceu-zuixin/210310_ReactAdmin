import React, { Component } from 'react'
// import { Redirect } from 'react-router'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import {Redirect,Route,Switch} from 'react-router-dom'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Home from '../home/home'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'


const { Footer, Sider, Content } = Layout;

export default class admin extends Component {
    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{height:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin:20 ,backgroundColor:"#fff"}}>
                        <Switch>
                            <Route path='/home' component={Home} /> 
                            <Route path='/category' component={Category} /> 
                            <Route path='/product' component={Product} /> 
                            <Route path='/role' component={Role} /> 
                            <Route path='/user' component={User} /> 
                            <Route path='/charts/bar' component={Bar} /> 
                            <Route path='/charts/line' component={Line} /> 
                            <Route path='/charts/pie' component={Pie} /> 
                            <Redirect to='/home' />
                        </Switch>
                    </Content>

                    <Footer style={{textAlign:'center',color:'green',fontSize:'16px'}}>推荐使用谷歌浏览器</Footer>
                </Layout>
            </Layout>
        )
    }
}
