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
    static propTypes = {
        // setClasses: PropTypes.func.isRequired,
        setForm: PropTypes.func.isRequired,
        categoryName: PropTypes.string.isRequired
    }


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

        this.formRef.current.setFieldsValue({
            input: categoryName
        })
    }
    //为form创建一个ref
    formRef = React.createRef()

    render() {
        console.log(this.props);
        // console.log(Form);
        const { categoryName } = this.props
        console.log(this.state);


        return (
            <Form
                initialValues={categoryName}
                ref={this.formRef}
                onValuesChange={this.onFinish}
            >
                <Item name='input' >
                    <Input
                        // initialValues={categoryName}
                        // value={categoryName}
                        // placeholder={categoryName}
                        ref={input => this.props.setForm(input)}
                    >
                    </Input>
                </Item>
            </Form>
        )
    }
}