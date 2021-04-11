import React, { Component } from 'react'
import {
    Form,
    // Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'


const Item = Form.Item
// const Option = Select.Option

/* 
更新分类的form组件
*/
export default class UpdateForm extends Component {

    //为form创建一个ref
    formRef = React.createRef()


    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categoryName: PropTypes.string.isRequired,
        deliverForm: PropTypes.func.isRequired,

    }

    deliverResult = () => {
        // 把form对象传出去，实时的，所以最后用的是完整的
        this.props.deliverForm(this.formRef.current)
    }

    // 啥也没写，一堆测试代码
    UNSAFE_componentWillMount() {
        // 将form对象通过setForm()传递给父组件
        // this.props.setForm(Item.form)
        // console.log('???' + Form.form);
        // const { categoryName } = this.props
        // this.setState({
        //     value: categoryName
        // })
        // form.setFieldsValue({
        //     value: categoryName
        // })
        // this.formRef.current.setFieldsValue({
        //     input: categoryName
        // })
        console.log('forRef', this.formRef);
    }

    componentDidMount() {
        console.log('forRef,after', this.formRef);

        const { categoryName } = this.props

        // 设置的是name为input的组件的value
        this.formRef.current.setFieldsValue({
            input: categoryName
        })
        
        // 一上来就得有一个form对象传出去，不然外面的操作无法进行
        this.props.deliverForm(this.formRef.current)

    }

    componentWillUnmount() {
        console.log('我是update，我结束了');
    }


    render() {
        console.log(this.props);
        // console.log(Form);

        return (
            <Form ref={this.formRef} onValuesChange={this.deliverResult}>
                <Item name='input'
                    rules={[
                        {
                            required: true,
                            message: '分类名称必须输入'
                        }
                    ]}>
                    <Input
                        ref={input => this.props.setForm(input)}
                    >
                    </Input>
                </Item>
            </Form>
        )
    }
}