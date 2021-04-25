import React, { Component } from 'react'
import {
    Form,
    Input,
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item


/* 
添加分类的form组件
*/
export default class AddForm extends Component {

    // 创建一个ref
    formRef = React.createRef()

    //这个propTypes的验证规则，可以不写，影响不大，写了这个是会检验传进来的props是否符合规则
    static propTypes = {
        deliverForm: PropTypes.func.isRequired,
    }

    //把form的实例对象传出去
    componentDidMount(){
        this.props.deliverForm(this.formRef.current)
    }

    render() {

        // 根据24格栅格系统来设置的
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        return (
            <Form
                ref={this.formRef}
            >
                <Item
                    {...layout}
                    name='roleName'
                    label='角色名称'
                    rules={[
                        {
                            required: true,
                            message: '角色名称必须输入'
                        }
                    ]}
                >
                    <Input
                        placeholder='请输入角色名称'
                    />
                </Item>
            </Form>
        )
    }
}