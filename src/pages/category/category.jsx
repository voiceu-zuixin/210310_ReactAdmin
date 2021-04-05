import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    message,
    // Pagination
} from 'antd'
import LinkButton from '../../components/link-button'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { reqCategorys } from '../../api'




export default class Category extends Component {

    state = {
        categorys: [],//一级分类列表
        loading: false,//是否正在获取数据中
        parentId: '0',//当前需要显示的分类鞋标的parentId
        parentName: '',//当前需要显示的分类列表的父分类名称
        subCategorys: [],//二级分类列表
    }

    // 初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                // dataIndex: 'name',//这个参数对render的传参起作用，如果不写dataIndex，那么render的第一个参数就是整行的对象
                //如果写了这个参数，那么第一个text参数就是这行的值，第二个record参数才是整行的数据对象   
                render: (text, category) => (//
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理函数，并传入数据 */}
                        {this.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}

                    </span>
                )
            },
        ];
    }

    // 异步获取一级分类列表或者二级分类列表
    getCategorys = async () => {
        //在发送请求前，显示loading
        this.setState({
            loading: true
        })
        //发异步ajax请求，获取数据
        const { parentId } = this.state
        const result = await reqCategorys(parentId)
        // console.log('---',result);
        //在请求完成后，隐藏loading
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            // 取出的分类列表可能是一级也可能是二级
            const categorys = result.data
            if (parentId === '0') {
                //更新一级状态
                this.setState({
                    categorys,
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    //显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {//在状态更新且重新render()后执行
            console.log('parentId', this.state.parentId)
            // 获取二级分类列表显示
            this.getCategorys()
        })
        // setState()不能立即获取更新后的状态，因为setState()是异步更新的，需要在里面的第二个参数里写回调函数才能
        // 不能在外部写，得不到返回的数据，外部是同步函数
        console.log(category);
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    // 发送异步ajax请求
    componentDidMount() {
        this.getCategorys()
    }

    render() {

        // 读取状态中的列表
        const { categorys, loading, subCategorys, parentId, parentName } = this.state

        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton>一级分类列表</LinkButton>
                <ArrowRightOutlined />
            </span>
        )
        // card的右侧
        const extra = (
            <Button type="primary">
                <PlusOutlined />
                添加
            </Button>
        )


        // const dataSource1 = [
        //     {
        //         "parentId": "0",
        //         "_id": "1",
        //         "name": "家用电器1",
        //         "__v": 0,
        //         "place":'xx1'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "2",
        //         "name": "家用电器2",
        //         "__v": 0,
        //         "place":'xx2'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "3",
        //         "name": "家用电器3",
        //         "__v": 0,
        //         "place":'xx3'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "4",
        //         "name": "家用电器4",
        //         "__v": 0,
        //         "place":'xx4'
        //     },
        // ];


        return (
            <Card title={title} extra={extra} >
                <Table dataSource={categorys}
                    rowKey="_id"
                    bordered
                    loading={loading}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    columns={this.columns} />
                {/* <Pagination showQuickJumper defaultCurrent={2} total={500} disabled /> */}
            </Card>
        )
    }
}
