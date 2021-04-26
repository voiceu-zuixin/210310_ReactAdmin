import React, { Component } from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option


/* 
添加分类的form组件
*/
export default class AddForm extends Component {

    // 创建一个ref
    formRef = React.createRef()

    static propTypes = {
        categorys: PropTypes.array.isRequired,//一级分类的数组
        parentId: PropTypes.string.isRequired,//父分类的id
        // setForm: PropTypes.func.isRequired,
        deliverForm: PropTypes.func.isRequired,

        // setClasses: PropTypes.func.isRequired,
        // setInput: PropTypes.func.isRequired
    }

    // 传递数据
    deliverResult = () => {//会出现一种情况就是，如果不进行修改数据，
                            // 就不会触发，那么就不会传出form对象，后续基于form的操作就无法实现
        // const resultValue = this.formRef.current.getFieldsValue()
        // console.log('resultValue', resultValue);
        // this.props.setForm(resultValue)
        this.props.deliverForm(this.formRef.current)
    }

    componentDidMount() {

        // 给分类下拉菜单添加初始值value,classer是select组件被包装成Item后的name
        // select的option，value在这里是设置的c._id，所以会先渲染好每一个option
        // 此处的预设初始值，是根据value来找到对应的option，该option是渲染好的，会显示c.name，下拉框会对应该项，并显示灰色
        // 但是如果我设置此处的value为c.name，但是又是通过parentId找，那就找不到对应的option
        // 那就会显示一个新的option，value和显示的都是parentId，并且在预先渲染好的下拉框中找不到，
        const { parentId } = this.props
        this.formRef.current.setFieldsValue({
            classer: parentId
        })

        console.log(this.formRef.current);

        // 一上来就得有一个form对象传出去，不然外面的操作无法进行
        this.props.deliverForm(this.formRef.current)


        //能工作，但是不能在didmount里面使用，因为这个是为了收集表单数据 
        // 但是，didmount里面只是刚打开这个弹窗，没有进行操作，所以无法得到想要的数据，
        // 可以先预设值进去，然后在didmount里用，应该可以，注意先后顺序
        // const aa = this.formRef.current.getFieldsValue()
        // console.log('aa', aa);
        // this.props.setForm(this.formRef)

    }

    componentWillUnmount() {
        // console.log('我结束了');
        // const resultValue = this.formRef.current.getFieldsValue()
        // console.log('resultValue', resultValue);
        // this.props.setForm(resultValue)
    }

    UNSAFE_componentWillMount() {
        // this.props.setForm(this.formRef)
    }


    render() {

        const { categorys } = this.props
        return (
            <Form ref={this.formRef} onValuesChange={this.deliverResult}>
                <Item name='classer'>
                    <Select >
                        <Option value='0'>一级分类</Option>
                        {
                            //getFieldsValue()得到的是value的值
                            categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item name='input'
                    rules={[
                        {
                            required: true,
                            message: '分类名称必须输入'
                        }
                    ]}
                >
                    <Input
                        placeholder='请输入分类名称'
                    />
                </Item>
            </Form>
        )
    }
}