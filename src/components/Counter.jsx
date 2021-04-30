import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import {increment,decrement} from '../redux/actions'

export default class Counter extends Component {
    // 设置props的验证格式
    static propTypes = {
        count: PropTypes.number.isRequired,
        user: PropTypes.string.isRequired,
        increment: PropTypes.func.isRequired,
        decrement: PropTypes.func.isRequired,
        incrementAsync: PropTypes.func.isRequired,
        changeUser: PropTypes.func.isRequired,
    }

    increment = () => {
        this.props.increment(1)
    }

    decrement = () => {
        this.props.decrement(1)
    }

    incrementOdd = () => {
        if (this.props.count % 2 === 1) {

            this.props.increment(1)
        }
    }

    incrementSeconds = () => {
        setTimeout(() => {
            this.props.increment(1)

        }, 2000);
    }

    thunkIncrement = () => {
        this.props.incrementAsync(1)
    }

    changeUser=()=>{

        this.props.changeUser('ccc')
    }

    render() {
        return (
            <div>
                计算后的数为{this.props.count}
                <br />
                当前用户为{this.props.user}
                <br />
                <br />
                <button onClick={this.increment}>点我加一</button>
                <button onClick={this.decrement}>点我减一</button>
                <button onClick={this.incrementOdd}>点我在奇数的时候加一</button>
                <button onClick={this.incrementSeconds}>点我延迟两秒加一</button>
                <button onClick={this.thunkIncrement}>thunk异步延迟1秒加一</button>

                <br />
                <button onClick={this.changeUser}>换人</button>
            </div>
        )
    }
}
