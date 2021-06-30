import React from 'react';
import Container from './Container';

class Disease extends React.Component{
    constructor(props){
        super(props);
        this.state={
            medications: [],
            avoid: []
        }
    }
    addDisease(event){
        event.preventDefault();
        var disObj={}
        disObj['name']=document.querySelector('input[name=new_disease]').value;
        disObj['medications']=this.state.medications;
        disObj['avoid']=this.state.avoid;
        this.setState({
            medications: [],
            avoid: []
        });
        this.props.addDisease(disObj);
    }
    addMedication(diseaseName,medicine){
        console.log('Disease.js: addMedication(): ',medicine)
        var list=this.state.medications;
        list.push(medicine);
        this.setState({
            medications: list
        });
    }
    addAvoid(diseaseName,avoid){
        var list=this.state.avoid;
        list.push(avoid);
        this.setState({
            avoid: list
        });
    }
    removeMedication(medication){
        var list=[];
        for(var i=0;i<this.state.medications.length;i++){
            if(this.state.medications[i]!=medication){
                list.push(this.state.medications[i]);
            }
        }
        this.setState({
            medications: list
        });
    }
    removeAvoid(avoid){
        var list=[];
        for(var i in this.state.avoid.length){
            if(this.state.avoid[i]!=avoid){
                list.push(this.state.avoid[i]);
            }
        }
        this.setState({
            avoid: list
        });
    }
    getDiseasesComponent(){
        var diseaseList=[];
        for(var key in this.props.currentDiseases){
            diseaseList.push(key);
        }
        console.log(diseaseList);
        return <ul>{diseaseList.map((dis)=><li key={dis}>
                {dis}<br/>
                Medications: 
                <Container type='medication' addElm={this.props.addMedication} diseaseName={dis} removeElm={this.props.removeMedication} list={this.props.currentDiseases[dis]['medications']}/>
                Avoid: 
                <Container type='avoid' addElm={this.props.addAvoid} diseaseName={dis} removeElm={this.props.removeAvoid} list={this.props.currentDiseases[dis]['avoid']}/>
            </li>)}
            Disease Name: <input type='text' name='new_disease'/><br/>
            Medications: 
            <Container type='new_medication' addElm={this.addMedication.bind(this)} removeElm={this.removeMedication.bind(this)} list={this.state.medications}/>
            Avoid: 
            <Container type='new_avoid' addElm={this.addAvoid.bind(this)} removeElm={this.removeAvoid.bind(this)} list={this.state.avoid}/>
            <button onClick={this.addDisease.bind(this)}>Add Disease</button>
        </ul>;
    }
    render(){
        return this.getDiseasesComponent();
    }
}
export default Disease;