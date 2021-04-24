import React, { Component } from 'react'
import {
    Card,
    List,

} from 'antd'
import {
    // PlusOutlined,
    // ArrowRightOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const Item = List.Item


/* 
Product的详情子路由组件
*/
export default class ProductDetail extends Component {
    state = {
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }

    async componentDidMount() {
        //得到当前商品的分类ID
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') {//一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {//二级分类下的商品
            /* 
            通过多个await方式发送多个请求：后面的请求是在前一个请求成功返回后菜发送
            此处应该用promise.all()
            const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
             */

            //返回的数组顺序不是异步请求谁先回来谁第一，而是最开始的顺序
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }


    render() {
        const { name, price, desc, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state
        console.log(cName1, '---', cName2);
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{ color: 'green', marginRight: 15, fontSize: 20 }}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item className='product-item'>
                        <span className='left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item className='product-item'>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item className='product-item'>
                        <span className='left'>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item className='product-item'>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? '-->' + cName2 : ''}</span>
                    </Item>
                    <Item className='product-item'>
                        <span className='left'>商品图片：</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        className='product-img'
                                        src={BASE_IMG_URL + img}
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item className='product-item'>
                        <span className='left'>商品详情：</span>
                        <span
                            dangerouslySetInnerHTML={{ __html: detail }}
                            style={{
                                textAlign: 'center',
                                verticalAlign:'baseline',
                            }}>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
