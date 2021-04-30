import React, { Component } from 'react'
import {
    Form,
    Select,
    Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option


/* 
添加分类的form组件
*/
export default class UserForm extends Component {

    // 创建一个ref
    formRef = React.createRef()

    componentDidMount() {
        this.props.deliverForm(this.formRef.current)
    }


    render() {
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };

        const { roles, user } = this.props

        return (
            <Form
                ref={this.formRef}
                onValuesChange={this.deliverResult}
                {...layout}
                initialValues={{
                    username: user.username,
                    password: user.password,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id,
                }}
            >
                <Item
                    label='用户名称'
                    name='username'
                    rules={[{
                        required: true,
                        message: '用户名称必须输入',
                    },
                    { min: 4, message: "用户名最少4位" },
                    ]}
                >
                    <Input placeholder='请输入角色名称' />
                </Item>
                {
                    user._id ? null : (
                        <Item
                            label='密码'
                            name='password'
                            rules={[{
                                required: true,
                                message: '密码必须输入',
                            },
                            { min: 4, message: "密码最少4位" },
                            ]}
                        >
                            <Input type='password' placeholder='请输入密码' />
                        </Item>
                    )
                }

                <Item
                    label='手机号'
                    name='phone'
                    rules={[{
                        required: true,
                        message: '手机号必须输入',
                    },
                    { min: 11, message: "请输入至少11位手机号" },
                    { max: 11, message: '手机号不能超过11位' },
                    ]}
                >
                    <Input placeholder='请输入手机号' />
                </Item>
                <Item
                    label='邮箱'
                    name='email'
                    rules={[{
                        required: true,
                        message: '邮箱必须输入',
                    },
                    { type: 'email', message: '请输入格式合法的邮箱' },

                    ]}
                >
                    <Input type='email' placeholder='请输入邮箱' />
                </Item>

                <Item
                    label='角色'
                    name='role_id'
                    rules={[{
                        required: true,
                        message: '角色必须选择',
                    }]}
                >
                    <Select
                        placeholder='请选择角色'
                    >
                        {
                            roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}