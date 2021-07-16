import React, { Component, createRef } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    // Upload,
    Button,
    message,
} from 'antd'
import LinkButton from '../../components/link-button'
import {
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input



/* 
Product的添加和更新的子路由组件
*/
export default class ProductAddUpdate extends Component {

    state = {
        options: [],//一开始来空数组，在didmount的时候更新
    }

    // 为Form创建一个ref
    formRef = React.createRef()

    //为price的input新建一个ref
    inputRef = createRef();

    // PicturesWall
    picturesWallRef = React.createRef()

    // 为RichTextEditor新建一个ref
    richTextEditorRef = React.createRef()


    // submit事件
    submit = () => {
        console.log(this.formRef.current);
        this.formRef.current.validateFields()
            .then(async values => {
                console.log(values);

                // 收集数据，并封装成product对象
                const { name, desc, price, categoryIds } = values
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                // 收集图片的内容
                const imgs = this.picturesWallRef.current.getImgs()

                // 收集富文本编辑器的内容
                const detail = this.richTextEditorRef.current.getDetail()

                // 封装进product对象
                const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }

                // 如果是更新，需要添加_id
                if (this.isUpdate) {
                    product._id = this.product._id
                }

                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
                // alert('发送ajax请求')
            })
            .catch(error => {
                console.log('error', error);
            })
    }

    /* 
    异步获取一级/二级分类列表，并显示
    在didmount的时候就要进行调用
    async函数的返回值是一个新的promise对象，其结果和返回值是由async的结果来决定的
    */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data

            // 如果是一级分类列表
            if (parentId === '0') {
                // console.log(categorys);
                this.initOptions(categorys)
            } else {//否则就是二级列表

                //返回二级列表,这样当前函数返回的promise就会成功状态并且value是categorys
                return categorys
            }

        }
    }

    //根据categorys生成options数组，更新options的状态
    initOptions = async (categorys) => {

        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,//不是叶子，具体要看是否有下一级
            // isLeaf:this.getCategorys(c._id).length === 0 ? true : false,
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)

            // 关联到对应的一级option上
            targetOption.children = childOptions
        }


        // 更新options的状态
        this.setState({
            options,
        })
    }

    componentDidMount() {
        this.getCategorys('0')

    }


    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;

        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联到当前的options
            targetOption.children = childOptions

        } else {//当前选中的分类没有二级分类
            // 即当前为叶子节点，不必往下展示
            targetOption.isLeaf = true
        }

        // 隐藏loading
        targetOption.loading = false;


        //#region
        // 模拟请求异步获取二级列表数据
        // setTimeout(() => {
        //     targetOption.children = [
        //         {
        //             label: `${targetOption.label} Dynamic 1`,
        //             value: 'dynamic1',
        //             isLeaf: true,
        //         },
        //         {
        //             label: `${targetOption.label} Dynamic 2`,
        //             value: 'dynamic2',
        //         },
        //     ];
        // }, 1000);
        //#endregion


        this.setState({
            options: [...this.state.options]
        })
    };

    // 验证价格函数
    validatePrice = (rule, value) => {
        if (value * 1 > 0) {
            return Promise.resolve()
        }
        return Promise.reject(new Error('价格必须大于0'))
    }


    change = () => {

    }
    inputChange = (event) => {
        // if (!this.isOnComposition) {
        //     console.log('我是event', event);
        //     if (event === undefined) {
        //         console.log(this.inputRef.current);
        //         const tempPrice = this.tempPrice || 'a'
        //     }
        // }
        // console.log('改变了2');
        // this.change()

        // this.inputRef.current.state.value = this.tempPrice
        // console.log('我是inputChange的tempprice', this.tempPrice);
        // console.log('我是inputChange的this.inputRef.current.state.value', this.inputRef.current.state);
        // this.inputRef.current.state.value = 7

        // console.log('我是inputChange的inputref', this.inputRef.current);
        // if (this.isOnComposition) {
        //     // this.props.onChange(evt);
        //     this.inputRef.current.state.value = ''
        // }
        // console.log('inputchange', this.formRef.current.getFieldValue('price'));
    }

    // 处理价格输入框的中文输入法问题，具体写了博客
    handleComposition = evt => {
        if (evt.type === 'compositionend') {
            this.isOnComposition = false;
            const tempPrice = this.tempPrice || 'a'

            // eslint-disable-next-line
            this.formRef.current.setFieldsValue({
                'price': tempPrice
            })
            return;
        }
        this.isOnComposition = true;
        this.tempPrice = this.inputRef.current.state.value
    };

    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state//可能有也可能没有
        // 保存是否更新的标识
        this.isUpdate = !!product//强制转换为bool类型
        // 保存商品，如果没有就保存空对象避免报错
        this.product = product || {}
    }




    render() {

        // 从this中取出是否更新的标识，其实可以直接用this.isUpdate，只是有些地方不能用.
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product

        // 用来接收级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            // 商品是一级分类的商品，父id为0
            if (pCategoryId === '0') {

                categoryIds.push(categoryId)

            } else {// 商品是二级分类的商品

                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }

        // 根据24格栅格系统来设置的
        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 7 },
        };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form
                    {...layout}
                    ref={this.formRef}
                    onValuesChange={this.change}
                    initialValues={{
                        name: product.name,
                        desc: product.desc,
                        price: product.price,
                        categoryIds,
                    }}
                >
                    <Item
                        label='商品名称:'
                        name='name'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称',
                            },
                        ]}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Item>
                    <Item
                        label='商品描述:'
                        name='desc'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品描述',
                            },
                        ]}
                    >
                        <TextArea
                            placeholder="请输入商品描述"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Item>
                    <Item
                        label='商品价格:'
                        name='price'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品价格',
                            },
                            // 验证价格
                            { validator: this.validatePrice },
                        ]}
                    >
                        <Input
                            ref={this.inputRef}
                            onChange={this.inputChange}
                            onCompositionStart={this.handleComposition}
                            onCompositionEnd={this.handleComposition}
                            placeholder='请输入商品价格'
                            type='number'
                            addonAfter="元"
                        />
                    </Item>
                    <Item
                        label='商品分类:'
                        name='categoryIds'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品分类',
                            },
                        ]}>
                        <Cascader
                            placeholder='请输入商品分类'
                            options={this.state.options}//需要显示ID列表数据数组
                            loadData={this.loadData}/* 当选择某个列表项时，加载下一级列表的监听回调 */
                        />
                    </Item>
                    <Item label='商品图片:'>
                        <PicturesWall ref={this.picturesWallRef} imgs={imgs} />
                    </Item>
                    <Item
                        label='商品详情:'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RichTextEditor ref={this.richTextEditorRef} detail={detail} />
                    </Item>
                    <Item>
                        <Button
                            type='primary'
                            onClick={this.submit}
                            style={{ marginLeft: 65 }}
                        >

                            提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
