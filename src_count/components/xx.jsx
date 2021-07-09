import React, { Component } from 'react'

export default class Xx extends Component {
    render() {
        console.log('xx',this.props);
        // console.log(this.props.store);
        console.log('context',this.context);
        return (
            <div>
                xx
                {this.props.count}
                {this.props.user}
                
            </div>
        )
    }
}
