import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    message,
    Modal,
} from 'antd'
import LinkButton from '../../components/link-button'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
    reqCategorys,
    reqUpdateCategorys,
    reqAddCategorys
} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'




export default class Category extends Component {

    state = {
        categorys: [],//一级分类列表
        loading: false,//是否正在获取数据中
        parentId: '0',//当前需要显示的分类鞋标的parentId
        parentName: '',//当前需要显示的分类列表的父分类名称
        subCategorys: [],//二级分类列表
        showStatus: 0,//标识添加、更新的确认框是否显示，0：都不显示；1：显示添加；2：显示更新
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
                        <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理函数，并传入数据,但是前面的括号不要加形参，括号的形参代表的是该组件收集的数据，不一样的组件信息不一样 */}
                        {/* 在jsx里面用大括号，是特定语法，jsx里面不能用if-else语句，只能用这种三元表达式，而且能够直接返回结果进入页面 */}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}

                    </span>
                )
            },
        ];
    }

    // 异步获取一级分类列表或者二级分类列表
    getCategorys = async (parentId) => {//parentId如果指定了，就根据指定的，如果没指定，就从state中读取
        // console.log(parentId);
        //在发送请求前，显示loading
        this.setState({
            loading: true
        })
        //发异步ajax请求，获取数据
        parentId = parentId || this.state.parentId
        // console.log(parentId);

        const result = await reqCategorys(parentId)
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
                console.log('getCategory', parentId);
                console.log(categorys);
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
        console.log('sub', this.state.subCategorys);
    }

    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //显示更新的确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })

    }

    //点击后显示指定的一级分类列表
    showParentCategorys = () => {
        //更新为显示一级列表的状态，state改变后会自动render以此
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        },
            //此处会在setState完成后再进行调用,这是第一种做法，为了和视频保持一致，以防后续会用到其中的方法
            // 暂时先用视频里的方法，而且这种方法，就算不是添加新分类，点回去都会重新渲染，性能不如方法二
            // () => { this.getCategorys() }
        )

        console.log('show', this.state.parentId);
    }

    /* 
    响应点击取消：隐藏对话框
    */
    handleCancel = () => {

        console.log('点击取消后', this.form);

        // 隐藏对话框
        this.setState({
            showStatus: 0
        })
    }

    /* 
    添加分类
    */
    addCategory = async () => {

        // 表单验证通过后菜进行处理,validateFields()方法使用形式也改变了，显示是promise形式
        const deliForm = this.deliForm
        deliForm.validateFields()
            .then(async (values) => {
                console.log('我是add的values', values);
                // 隐藏对话框
                this.setState({
                    showStatus: 0
                })

                // 为什么无法显示，因为是点击这个，才会关闭对话框，然后清除modal里的组件
                // 然后form被unmount，才会触发willUnmount，才会传出resultValue
                // 在此时，会将关闭对话框作为异步任务，是处于下方打印代码之后，所以数据还未传出
                // 要在传出后进行打印，所以应该换个地方打印，或者写成async？？？
                // 或者不把传出代码写在willunmount中,   
                // 问题解决了，给Form设置一个onValuesChange事件，然后在这个方法中，写上传出数据，这个是动态的传出
                console.log('cate_resultValue2', this.resultValue);
                // const { input, classer } = this.resultValue
                const { input, classer } = deliForm.getFieldsValue()
                // console.log(this.deliForm.getFieldsValue);
                const categoryName = input
                const parentId = classer
                const result = await reqAddCategorys(categoryName, parentId)
                if (result.status === 0) {
                    // 如果当前分类列表就是要添加的页面，才需要重新获取分类列表
                    if (parentId === this.state.parentId) {
                        // 重新获取分类列表显示
                        this.getCategorys()
                    } else if (parentId === '0') {//在二级分类列表下添加一级分类，重新获取一级分类列表，但是不需要显示
                        /* 
                        一种做法是在showParentCategorys里面的setState的回调里面调用，
                        这种做法，会在每次点击showParentCategorys都会调用，可能性能不太高
                        因为如果只是普通的跳转回一级列表，没有更改，不需要调用回调函数，getCategorys，这个是异步的，直接渲染就行，
                        但是这种做法会每次都异步请求，如果后端出问题了，还会卡住
                        */

                        // 另一种做法是改变getCategorys函数，给它添加一个形参parentId
                        this.getCategorys('0')//这里千万不能传入数字0，数字0会被判断为false，要传入'0'
                    }
                }
            })
            .catch(err => {
                console.log('error', err);
            })

        console.log('deliForm', this.deliForm);
        const xx = this.deliForm.getFieldsValue()
        console.log('xx', xx);

    }

    /*
    更新分类
    */
    updateCategory = async () => {


        // 表单验证通过后菜进行处理,validateFields()方法使用形式也改变了，显示是promise形式
        const deliForm = this.deliForm
        console.log(deliForm);
        deliForm.validateFields()
            .then(async (values) => {
                console.log('验证成功');
                console.log('我是update的values', values);

                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                //准备数据
                const categoryId = this.category._id
                const categoryName = this.form.props.value
                console.log('this.form', this.form);

                console.log('this.deliForm', this.deliForm);
                console.log('this.deliForm', this.deliForm.getFieldsValue().input);

                console.log(categoryName);
                //发请求，更新分类
                const result = await reqUpdateCategorys(categoryId, categoryName)
                if (result.status === 0) {
                    //重新显示列表 
                    this.getCategorys()

                }
                console.log(this.form);

            })
            .catch(err => {
                console.log('error', err);
            })



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
        const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
        // console.log(parentId);

        // 读取点击修改弹出框中，预设的指定分类
        const category = this.category || { name: 'temp' }//如果暂时还没有，则制定一个空对象



        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showParentCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined />  &nbsp;
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table dataSource={parentId === '0' ? categorys : subCategorys}
                    rowKey="_id"
                    bordered
                    loading={loading}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    columns={this.columns} />
                {/* <Pagination showQuickJumper defaultCurrent={2} total={500} disabled /> */}

                <Modal title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    destroyOnClose={true}
                    onCancel={this.handleCancel}>
                    <AddForm categorys={categorys}
                        parentId={parentId}
                        // setForm={(form) => { this.resultValue = form }}
                        // 每一次传出来都会把前一次的deliForm替换掉，所以不用担心会形成数组
                        deliverForm={(form) => { this.deliForm = form }}
                    />
                </Modal>

                <Modal title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}

                    //用于关闭弹窗时，清除之前输入的数据，
                    // 但是暂时没有找到那个视频的功能在此版本的antd如何执行，就用这个标签，
                    // 每当关闭的时候，直接清除里面的组件，以此来达到效果
                    destroyOnClose={true}

                    onCancel={this.handleCancel}>
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                        deliverForm={(form) => { this.deliForm = form }}
                    />
                </Modal>
            </Card>

        )




        // const dataSource1 = [
        //     {
        //         "parentId": "0",
        //         "_id": "1",
        //         "name": "家用电器1",
        //         "__v": 0,
        //         "place": 'xx1'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "2",
        //         "name": "家用电器2",
        //         "__v": 0,
        //         "place": 'xx2'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "3",
        //         "name": "家用电器3",
        //         "__v": 0,
        //         "place": 'xx3'
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "4",
        //         "name": "家用电器4",
        //         "__v": 0,
        //         "place": 'xx4'
        //     },
        // ];
    }
}
