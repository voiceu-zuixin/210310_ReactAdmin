import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'

export default class Role extends Component {

    state = {
        roles: [
            // {
            //     'menu': [
            //         '/home',
            //         '/products',
            //         '/role'
            //     ],
            //     '_id': '2231',
            //     'name': '角色1',
            //     'create_time': 1554639552758,
            //     '__v': 0,
            //     'auth_time': 1557630307021,
            //     'auth_name': 'admin',
            // },
            // {
            //     'menu': [
            //         '/home',
            //         '/products',
            //         '/role'
            //     ],
            //     '_id': '22312',
            //     'name': '角色2',
            //     'create_time': 1554639552758,
            //     '__v': 0,
            //     'auth_time': 1557630307021,
            //     'auth_name': 'admin',
            // },
            // {
            //     'menu': [
            //         '/home',
            //         '/products',
            //         '/role'
            //     ],
            //     '_id': '22313',
            //     'name': '角色3',
            //     'create_time': 1554639552758,
            //     '__v': 0,
            //     'auth_time': 1557630307021,
            //     'auth_name': 'admin',
            // },
        ],//所有角色的列表
        role: {},//选中的role，开始的时候没有对象，意思是没有选中，当onRow时，选中
        isShowAdd: false,//是否显示添加页面
        isShowAuth: false,//是否显示设置权限界面

    }

    //给autn创建一个ref
    auth = React.createRef()

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }


    onRow = (role) => {
        return {
            onClick: event => {
                // 点击行的回调把option选中
                console.log(role);
                //把role放进state中
                this.setState({
                    role
                })
            }
        }
    }

    //如果不写这个，那么单独选择圆孔的时候不会被选中，因为亮起被选中的是根据state来的
    onSelect = (role) => {
        // console.log(role);
        this.setState({
            role
        })
    }

    /* 添加角色 */
    addRole = () => {
        //隐藏输入框
        this.setState({
            isShowAdd: false
        })

        // 进行表单验证
        this.deliForm.validateFields()
            //验证通过
            .then(async values => {

                // 收集输入数据
                const { roleName } = values
                this.deliForm.resetFields()

                // 请求添加
                const result = await reqAddRole(roleName)
                // 根据结果提示更新列表显示
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // 显示最新的列表
                    const role = result.data

                    // 不建议用push方法
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })
                    this.setState((state, props) => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败')
                }
            })
    }

    //更新角色的回调
    updateRole = async () => {

        //隐藏tree框
        this.setState({
            isShowAuth: false
        })

        const role = this.state.role
        console.log(this.auth.current);
        const menus = this.auth.current.getMenus()

        console.log(this.auth.current.getMenus());
        role.menus = menus
        role.auth_name = memoryUtils.user.username

        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            this.getRoles()
            // 如果当前更新的是自己的角色权限，则强制退出
            if (role._id === memoryUtils.user.role._id) {
                message.success('更新当前角色权限成功')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            } else {
                message.success('更新角色成功')
            }
        } else {
            message.error('更新角色失败')
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state
        const total = roles.length
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;
                <Button type='primary'
                    onClick={() => this.setState({ isShowAuth: true })}
                    disabled={role._id ? false : true}
                >设置角色权限</Button>
            </span>
        )



        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    pagination={{
                        total: total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type: 'radio',
                        columnWidth: '55px',
                        selectedRowKeys: [role._id],
                        onSelect: this.onSelect
                    }}
                    onRow={this.onRow}
                />

                <Modal title="添加分类"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false
                        })
                    }}>
                    <AddForm
                        // 每一次传出来都会把前一次的deliForm替换掉，所以不用担心会形成数组
                        deliverForm={(form) => { this.deliForm = form }}
                    />
                </Modal>

                <Modal title="设置角色权限"
                    visible={isShowAuth}
                    destroyOnClose
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })
                    }}>
                    <AuthForm
                        // 每一次传出来都会把前一次的deliForm替换掉，所以不用担心会形成数组
                        deliverForm={(form) => { this.deliForm = form }}
                        role={role}
                        ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}
