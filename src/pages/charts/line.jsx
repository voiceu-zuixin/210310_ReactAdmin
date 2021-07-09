import React, { Component } from 'react'

export default class Line extends Component {
    // state={
    //     count:1,
    //     num:33
    // }
    constructor(props) {
        console.log('constructor');
        super(props)
        // 初始化状态
        this.state = {
            count: 0,
            num: 66
        }
        this.state = {
            count: 3,
            // num:55
        }
    }

    state = {
        count: 2,
        num: 44
    }

    onClick = () => {

        console.log('点我后', this.state);

    }

    render() {

        console.log('render后', this.state);
        // this.state.count = 999
        return (
            <div>
                Line
                <button onClick={this.onClick}>dianwo </button>
            </div>
        )
    }
}
