import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increment, decrement, incrementAsync, changeUser } from '../redux/actions'
import Xx from './xx'

class Logs extends Component {
    render() {
        console.log('logs')
        return (
            <div style={{width:200,backgroundColor:'pink',}}>
                ???log
                <Xx></Xx>
            </div>
        )
    }
}
// console.log('logs',this.props.context)


export default connect(
    state => ({
        count: state.count,
        user:state.user
    }),
    { increment, decrement, incrementAsync, changeUser }
)(Xx)
