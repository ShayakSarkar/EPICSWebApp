import React from 'react';

class Container extends React.Component{
    constructor(props){
        super(props);
        console.log(props.type);
        console.log(props.list);
        this.contents='';
    }
    removeElm(e){
        e.preventDefault();
        console.log('remove',e.target.className);
        this.props.removeElm(this.props.diseaseName,e.target.className);
    }
    addElm(e){
        e.preventDefault();
        this.props.addElm(this.props.diseaseName,this.contents);
    }
    changeHandler(e){
        var value=e.target.value;
        this.contents=value;
    }
    render(){
        return <ul>
            {this.props.list.map(elm=><li key={elm}>{elm} <button className={elm} onClick={this.removeElm.bind(this)}>remove</button></li>)}
            <input onChange={this.changeHandler.bind(this)} type='text' name='new_elm'/><button onClick={this.addElm.bind(this)}>Add</button>
        </ul>;
    }
}

export default Container;