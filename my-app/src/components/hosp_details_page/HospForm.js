import React from 'react';
import './HospForm.css';

class HospForm extends React.Component{
    constructor(props){
        super(props);
        this.location=null;
        function setLocation(e){
            console.log('setLocation: ',e);
            this.location={'latitude':e.coords.latitude,'longitude':e.coords.longitude};
        }
        this.featureOptions=['Beds','Nurses','Doctors','ICUs'];
        this.state={
            selectedFeatures: [],
            //Databse se connect karne ke phele dekh lena ye line
            featureMap: {},
            fetchedData: false
        };
        window.navigator.geolocation.getCurrentPosition(setLocation.bind(this),console.log);
        console.log(this.location);
    }
    componentDidMount(){
        console.log('component mounted');
        fetch('http://localhost:5000/get_hospital_details/',{
            method: 'GET',
            credentials: 'include'
        })
        .then(function(e){
            return e.json();
        })
        .then((e)=>{
            console.log('receieved: ',e);
            var selectedFeatures=[];
            var featureMap={};
            for(var key in e){
                if(this.featureOptions.includes(key)){
                    selectedFeatures.push(key);
                    featureMap[key]=e[key];                    
                }
            }
            console.log(selectedFeatures);
            console.log(featureMap);
            document.querySelector('input[id=address]').value=e['address'];
            this.setState({
                featureMap: featureMap,
                selectedFeatures: selectedFeatures
            });
        })
        .catch(function(e){
            console.log(e)
        });
    }
    addFeature(event){
        event.preventDefault();
        console.log(document.querySelector('select[name=new_feature]')); 
        console.log(document.querySelector('input[name=new_feature]').value);
        var newFeature=document.querySelector('select[name=new_feature]').value; 
        var newValue=document.querySelector('input[name=new_feature]').value;
        var tempMap=this.state.featureMap;
        var tempList=this.state.selectedFeatures;
        tempList.push(newFeature);
        tempMap[newFeature]=newValue;
        this.setState({
            featureMap: tempMap,
            selectedFeatures: tempList
        });
    }
    sendData(event){
        event.preventDefault();
        var data=this.state.featureMap;
        data['location']=this.location;
        data['address']=document.querySelector('input[id=address]').value;
        fetch('http://localhost:5000/send_hospital_details/',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data)
        })
        .then((response)=>console.log(response))
        .catch(e=>{console.log(e)});
    }
    removeFeature(event){
        event.preventDefault();
        var feature=event.target.value;
        var tempList=[];
        var tempMap=this.state.featureMap;
        for(var i in this.state.selectedFeatures){
            if(this.state.selectedFeatures[i]!==feature){
                tempList.push(this.state.selectedFeatures[i]);
            }
        }
        delete tempMap[feature];
        this.setState({
            featureMap: tempMap,
            selectedFeatures: tempList
        });
    }
    render(){
        // eslint-disable-next-line array-callback-return
        var options=this.featureOptions.map((feature)=>{
            if(!this.state.selectedFeatures.includes(feature)){
                return <option key={feature}>{feature}</option>
            }
        });
        console.log(options);
        var ctr = 1;
        var setFeatures=this.state.selectedFeatures.map((feature)=>{
            return <div className = "Remove" key={feature} style={{
                top:((ctr++)*8)+'%'
            }}>{feature}--{'>'}{this.state.featureMap[feature]} 
            <button id = "remove" value={feature} onClick={this.removeFeature.bind(this)}>Remove
            </button>
            </div>;
        });
        return <div className="HospForm">
            <label id="lb4">Address</label><input type="text" id="address" />
            <div className ="temp">{setFeatures}</div>
            <select id = "sel1" name={'new_feature'}>
                {options}
            </select>
            <input type="text" id="ip1" name={'new_feature'} />
            <button id="add" onClick={this.addFeature.bind(this)}>Add</button><br/>
            <button id="submit" onClick={this.sendData.bind(this)}>Send Details</button>
        </div>;
    }
}
export default HospForm;
