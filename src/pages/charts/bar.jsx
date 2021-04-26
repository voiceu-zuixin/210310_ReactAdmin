import React, { Component } from 'react'

//柱状图
export default class Bar extends Component {
    x1=(x1)=>{
        console.log('x1',x1);
        console.log('x2',this.input);
        console.log(this.input.value);
    }
    x3=(x3)=>{
        console.log('x3',x3);
    }
    render() {
        return (
            <div>
                Bar
                {
                    1 === 2 ? 1 : 2
                }
            </div>
        )
    }
}
