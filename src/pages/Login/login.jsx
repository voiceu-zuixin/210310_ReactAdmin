import React, { Component } from 'react'
import './login.less'
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storeUtils from '../../utils/storageUtils'
import logo from '../../assets/images/logo.png'//按alt + <——可以快速回退到本文件
import { Redirect } from 'react-router'; 


export default class Login extends Component {
    // 成功提交后的操作===>登录
    onFinish =async (values) => {
        // console.log('Received values of form: ', values);
        // 登录
        const {username,password} = values
            const response = await reqLogin(username,password)
            console.log('成功了',response);
            const result = response//{status:0 , data:user} {status:1,msg:"xxx"}
            if(result.status === 0 ){
                //登录成功
                message.success('登录成功')

                //保存user
                const user = result.data
                memoryUtils.user = user//保存在内存中
                storeUtils.saveUser(user)//保存到local中


                //跳转到管理页面,用history跳转,(不需要再回退回登录页面)
                this.props.history.replace('/')
            }else{
                //登录失败,提示错误信息
                message.error(result.msg)
            }
    };
    // 提交失败的操作====>响应错误信息，无法登录
    onFinishFailed=({ values, errorFields, outOfDate })=>{
        // console.log(values);
        // console.log(errorFields);
        // console.log(outOfDate);
    }


    render() {
        //如果用户已经登录，就跳转到管理界面
        const user =  memoryUtils.user
        if(user && user._id){
            return <Redirect to='/'/>
        } 
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        // onSubmit={this.handleSubmit}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: 'Please input your Username!' },
                                { max: 12, message: "用户名最多12位" },
                                { min: 4, message: "用户名最少4位" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文、数字或下划线组成" },
                                { whitespace: true, message: "不能输入空格" }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, whitespace: true, message: 'Please input your Password!' },
                                { max: 12, message: "密码最多12位" },
                                { min: 4, message: "密码最少4位" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: "密码必须是英文、数字或下划线组成" },
                                { whitespace: true, message: "不能输入空格" }

                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/login">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                         </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
1、前台表单验证
2、收集表单数据
3、后台表单验证
*/