import React from 'react';
import './FormOption.css';

class FormOption extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className="FormOption"
            style={{
                height: this.props.height || '1%',
                width: this.props.width || '1%',
                left: this.props.left || '1%',
                top: this.props.top || '1%',
                padding: this.props.padding || '1%',
                backgroundColor: this.props.backgroundColor
            }}
            onClick={this.props.onClick}
        >
            {this.props.text}
        </div>;
    }
}
export default FormOption;
