import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddUser, reqUpdateUser } from '../../api'
import UserForm from './user-form'

export default class User extends Component {
    state = {
        users: [],//所有用户列表
        roles: [],//所有角色的列表
        isShow: false,//是否显示添加框
    }


    /* 根据role 的数组生成包含所有角色名的对象 */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
        // console.log(roleNames);
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                } else {
                    message.error('删除用户失败')
                }
            }
        })
    }

    // 显示修改页面
    showUpdate = (user) => {
        //保存user
        this.user = user
        console.log(user);
        this.setState({ isShow: true })
    }


    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                ),

            },
        ]
    }

    // 这样是为了点击创建用户的时候，不能读取上一次存起来的user
    onCancel = () => {
        this.setState({ isShow: false })
        this.user = {}
        // this.form.resetFields()
    }

    addOrUpdateUser = async () => {
        this.setState({ isShow: false })
        // 手机输入的数据
        console.log(this.form.getFieldsValue());
        const user = this.form.getFieldsValue()
        // this.form.resetFields()
        if (this.user) {
            // 要修改一下，也不知道当时为什么可以用
            // if (this.user._id) {
            console.log(user);
            user._id = this.user._id
            const result = await reqUpdateUser(user)
            if (result.status === 0) {
                message.success('更新用户成功')
                this.getUsers()
            } else {
                message.error('更新用户失败')
            }
        } else {
            // 提交添加的请求
            const result = await reqAddUser(user)
            if (result.status === 0) {
                message.success('添加用户成功')
                this.getUsers()
            } else {
                message.error('添加用户失败')
            }
        }
        this.user = {}
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }


    render() {

        const title = <Button type='primary' onClick={() => { this.setState({ isShow: true }) }}>创建用户</Button>
        const { users, isShow, roles } = this.state
        const user = this.user || {}
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    rowKey="_id"
                    bordered
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
                    columns={this.columns} />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    destroyOnClose={true}
                    onCancel={this.onCancel}
                >
                    <UserForm
                        deliverForm={(form) => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
