import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree,
} from 'antd'
import menuList from '../../config/menuConfig'


const Item = Form.Item

export default class AuthForm extends Component {

    constructor(props) {
        super(props)

        //根据传入的props来决定checkedKeys
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeData = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push({
                title: item.title,
                key: item.key,
                children: item.children ? this.getTreeData(item.children) : null
            })
            return pre
        }, [])
    }

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        this.setState({
            checkedKeys
        })
    };

    getMenus=()=> this.state.checkedKeys


    UNSAFE_componentWillMount() {
        this.treeData = this.getTreeData(menuList)
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        // 根据24格栅格系统来设置的
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };

        //#region 
        // const treeData = [
        //     {
        //         title: 'parent 1',
        //         key: '0-0',
        //         children: [
        //             {
        //                 title: 'parent 1-0',
        //                 key: '0-0-0',
        //                 disabled: true,
        //                 children: [
        //                     {
        //                         title: 'leaf',
        //                         key: '0-0-0-0',
        //                         disableCheckbox: true,
        //                     },
        //                     {
        //                         title: 'leaf',
        //                         key: '0-0-0-1',
        //                     },
        //                 ],
        //             },
        //             {
        //                 title: 'parent 1-1',
        //                 key: '0-0-1',
        //                 children: [
        //                     {
        //                         title: (
        //                             <span
        //                                 style={{
        //                                     color: '#1890ff',
        //                                 }}
        //                             >
        //                                 sss
        //                             </span>
        //                         ),
        //                         key: '0-0-1-0',
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // ];
        //#endregion

        const treeData = this.treeData
        return (
            <Form>
                <Item
                    {...layout}
                    name='roleName'
                    label='角色名称'
                    initialValue={`${role.name}`}
                >
                    <Input disabled />
                </Item>

                <Tree
                    checkable
                    treeData={treeData}
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                </Tree>
            </Form>
        )
    }
}
