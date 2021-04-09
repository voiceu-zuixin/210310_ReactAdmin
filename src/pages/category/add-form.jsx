import React, { Component } from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
// import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option


/* 
添加分类的form组件
*/
export default class AddForm extends Component {
    // static propTypes = {
    //     categorys: PropTypes.array.isRequired,
    //     setClasses: PropTypes.func.isRequired,
    //     setInput: PropTypes.func.isRequired
    // }
    render() {

        const { categorys } = this.props
        return (
            <Form onValuesChange={this.onFinish}>
                <Item name='classer'>
                    <Select initialValue='0' ref={input => this.props.setClasses(input)}>
                        <Option value='0'>一级分类</Option>
                        <Option value='0'>电脑</Option>
                        {categorys.map(c => <Option value={c._id}>{c.name}</Option>)}
                    </Select>
                </Item>
                <Item name='input'>
                    <Input initialValue='请输入分类名称'
                        ref={input => this.props.setInput(input)} />
                </Item>
            </Form>
        )
    }
}