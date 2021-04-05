import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { reqWeather } from '../../api'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'

import menuList from '../../config/menuConfig'
import './index.less'

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        weather: '',//天气文本
        // dayPicUrl: '',//天气图片url
    }
    getWeather = async () => {
        const weather = await reqWeather()
        this.setState({ weather })
    }

    getTitle = () => {
        //得到当前请求路径,要用withRouter包裹该组件，才能有location属性
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const citem = item.children.find(citem => citem.key === path)
                if (citem) {
                    title = citem.title
                }
            }
        })
        return title
    }
    //退出登录
    logout = () => {
        // const { confirm } = Modal;
        console.log('??');
        Modal.confirm({
            // title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗',
            onOk:()=> {
                console.log('OK',this);
                // alert('?')
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    componentDidMount() {
        //获取当前时间
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({
                currentTime
            })
        }, 1000);
        //获取天气数据
        this.getWeather()

    }
    //卸载掉计时器
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() {
        const { currentTime, weather } = this.state

        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    {/* <a href="javascript:" onClick={this.logout}>退出</a> */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                    {/* <Button
                        type="primary"
                        icon={<PoweroffOutlined />}
                        // loading={loadings[2]}
                        onClick={this.logout}
                    /> */}

                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/currentweather/night/02.png" alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)