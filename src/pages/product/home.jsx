import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
} from 'antd'
import LinkButton from '../../components/link-button'
import {
    PlusOutlined,
    // ArrowRightOutlined,
} from '@ant-design/icons';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        total: 0,//商品的总数量
        products: [],//商品的数组
        loading: false,//是否正在加载中
        searchName: '',//搜索的关键字
        searchType: 'productName',//根据哪个字段搜索

    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum

        this.setState({ loading: true })//显示loading

        const { searchName, searchType } = this.state
        // 如果搜索关键字有值，说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({
                pageNum,
                pageSize: PAGE_SIZE,
                searchName,
                searchType
            })
        } else {//否则就是普通分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false })//隐藏loading

        if (result.status === 0) {
            console.log('获取数据成功');
            // 取出数据
            const { total, list } = result.data
            // 更新状态
            this.setState({
                total,
                products: list,
            })
        } else {
            message.error('获取分类列表失败')
            console.log('获取分类列表失败');
        }
    }

    //更新指定商品的状态
    updateStatus = async(productId,status)=>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }else{
            message.error('更新商品失败')
        }
    }

    componentDidMount() {
        this.getProducts(1)
    }
    // 初始化列表
    initColumns = () => {
        this.columns = [
            {
                title: '姓名',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                width: 100,
                dataIndex: 'price',
                render: (price) => '￥' + price//有render 的，如果写了dataIndex，就传入dataIndex指定的数据
                //如果没有dataIndex，就传入整个product对象 
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={()=>this.updateStatus(_id,status===1?2:1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            {/* 此处不应该是return this.props。。。因为，目的是让这个函数执行，不是让他有一个返回值，
                                而且，就算有返回值，在这种情况下，也没有地方接收，所以this.props.history.push会返回一个undefined
                                然后再return上去一个undefined，没有地方接收这个，但是this.props.history.push也已经运行了，
                                所以对目标没有影响，但实际上不写return才是正确的，因为只有一行代码，所以可以省略花括号，
                                至于为什么纠结这个return，是因为教学视频里面用了花括号，然后把何时能省略return记混淆了
                                
                                1.使用了花括号，就不能省略return；
                                2.只有在省略了花括号的情况下，才有可能省略return
                                3.函数体只有一句的时候，可以省略花括号
                                4.只有一句的时候，并且是return xxx的时候，可以连带return一起省略
                                */}
                            {/* <LinkButton onClick={()=>{return this.props.history.push('/product/detail')}}>详情</LinkButton> */}
                            <LinkButton onClick={() => { this.props.history.push('/product/detail', { product }) }}>详情</LinkButton>
                            <LinkButton onClick={()=>{this.props.history.push('/product/addupdate',product)}}>修改</LinkButton>


                            {/* <LinkButton onClick={function xx() {
                                console.log('??')
                            }}>详情</LinkButton> */}
                            {/* <LinkButton onClick={console.log('??')}>详情</LinkButton> */}
                            {/* <LinkButton onClick={this.console}>修改</LinkButton> */}
                        </span>
                    )
                }
            },
        ];
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }


    render() {
        const { products, total, loading, searchName, searchType } = this.state
        const dataSource = products



        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => { this.setState({ searchType: value }) }}
                >
                    <Option value='productName'> 按名称搜索</Option>
                    <Option value='productDesc'> 按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => { this.setState({ searchName: event.target.value }) }}
                />
                <Button type='primary' onClick={() => { this.getProducts(1) }}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                {/* 表格 */}

                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    // rowKey={dataSource[0]._id}
                    // rowKey={(record,index)=>record._id}
                    // rowKey={(record,index)=>index}
                    // rowKey={dataSource._id}
                    pagination={{
                        total: total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                    dataSource={dataSource}
                    columns={this.columns}
                />
            </Card>
        )
    }
}
