import React from 'react';
import './DocForm.css';
import Disease from './Disease';
import Container from './Container';

class DocForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            patientDetails:{},
            showPatientCard: false,
            patientId: null
        };
    }
    componentDidMount(){
        fetch('http://localhost:5000/get_patient_details/',{
            method: 'GET',
            credentials: 'include'
        })
        .then(e=>e.json())
        .then(function(e){
            console.log('DocForm.js: componentDidMount(): ',e);
            this.setState({
                patientDetails: e['patient_details']
            });
        }.bind(this));
    }
    showPatientDetails(event){
        event.preventDefault();
        var patId=event.target.textContent;
        console.log(patId);
        console.log(this.state);
        this.setState({
            showPatientCard: true,
            patientId: patId
        })
    }
    addDisease(diseaseObj){
        var tempObj=this.state.patientDetails;
        console.log('DocForm.js: addDisease():',diseaseObj);
        tempObj[this.state.patientId]['current_medications'][diseaseObj['name']]={
            medications: diseaseObj['medications'],
            avoid: diseaseObj['avoid']
        };
        this.setState({
            patientDetails: tempObj
        });
    }
    removeDisease(diseaseName){
        var tempObj=this.state.patientDetails;
        delete tempObj[this.state.patientId]['current_medications'][diseaseName]
        this.setState({
            patientDetails: tempObj
        });
    }
    addMedication(diseaseName,medicine){
        console.log('DocForm.js: addMedication() ',diseaseName);
        console.log('DocForm.js: addMedication() medicine =',medicine);
        var tempObj=this.state.patientDetails;
        tempObj[this.state.patientId]['current_medications'][diseaseName]['medications'].push(medicine);
        this.setState({
            patientDetails: tempObj
        });
    }
    removeMedication(diseaseName,medicine){
        var tempObj=this.state.patientDetails;
        var list=tempObj[this.state.patientId]['current_medications'][diseaseName]['medications'];
        var newList=[];
        for(var i in list){
            if(list[i]!=medicine){
                newList.push(list[i]);
            }
        }
        tempObj[this.state.patientId]['current_medications'][diseaseName]['medications']=newList;
        this.setState({
            patientDetails: tempObj
        });
    }
    addAvoid(diseaseName,avoid){
        var tempObj=this.state.patientDetails;
        tempObj[this.state.patientId]['current_medications'][diseaseName]['avoid'].push(avoid);
        this.setState({
            patientDetails: tempObj
        });
    }
    removeAvoid(diseaseName,avoid){
        var tempObj=this.state.patientDetails;
        var newList=[];
        var list=tempObj[this.state.patientId]['current_medications'][diseaseName]['avoid'];
        for(var i in list){
            if(list[i]!=avoid){
                newList.push(list[i]);
            }
        }
        tempObj[this.state.patientId]['current_medications'][diseaseName]['avoid']=newList;
        this.setState({
            patientDetails: tempObj
        });
    }
    getPatientCard(patId){
        if(!patId){
            return <div></div>;
        }
        console.log('getPatientCard: patient id: ',patId);
        var disList=[];
        for(var key in this.state.patientDetails[patId]['medical_history']){
            disList.push(key);
        }
        function makeDiseaseDetail(details,name){
            return <div>
                Disease Name: {name}<br/>
                Medications: <br/>
                <ul>
                    {details['medications'].map((e)=><li key={e}>{e}</li>)}
                </ul>
                Things to Avoid: <br/>
                <ul>
                    {details['avoid'].map((e)=><li key={e}>{e}</li>)}
                </ul>
            </div>;
        }
        var medHistory=disList.map(dis=><li key={dis}>{makeDiseaseDetail(this.state.patientDetails[patId]['medical_history'][dis],dis)}</li>);
        return <div>
            Name: {this.state.patientDetails[patId]['name']}<br/>
            Age: {this.state.patientDetails[patId]['age']}<br/>
            Blood Group: {this.state.patientDetails[patId]['blood_group']}<br/>
            Medical History:<br/>
            <ul>
                {medHistory}
            </ul>
            Current Medications: <br/>
            <Disease currentDiseases={this.state.patientDetails[patId]['current_medications']}
                addDisease={this.addDisease.bind(this)}
                removeDisease={this.removeDisease.bind(this)}
                addMedication={this.addMedication.bind(this)}
                removeMedication={this.removeMedication.bind(this)}
                addAvoid={this.addAvoid.bind(this)}
                removeAvoid={this.removeAvoid.bind(this)}
            />
        </div>
    }
    sendData(e){
        e.preventDefault();
        fetch('http://localhost:5000/send_patient_data/',{
            method: 'POST',
            credentails: 'include',
            body: JSON.stringify(this.state.patientDetails)
        })
        .then(e=>e.json())
        .then(e=>{
            console.log(e);
        })
    }
    render(){
        var patientIds=[];
        /*
            data is of the form:
            data: [patid(email add): {
                    medical_history: [disease1:{
                            medications: [med1,med2,med3].
                            avoid: [av1,av2,av3]
                        },
                        disease2: {
                            medicatiosn: [med1,med2,med3],
                            avoid: [av1,av2,av3]
                        }
                    ],
                    current_medications: [disease1: {
                            medications: [],
                            avoid: []
                        },
                        disease2: {
                            medications: [],
                            avoid: []
                        },
                    ]
                },
                patid: ...,
                patid: ...
            ]
        */
        for(var key in this.state.patientDetails){
            patientIds.push(key);
        }
        var patientButtons=patientIds.map(id=><button key={id} onClick={this.showPatientDetails.bind(this)} className='PatientIdButton'>{id}</button>);
        patientButtons=<ul>{patientButtons}</ul>
        return <div>
            {patientButtons}
            <div style={{display: (this.state.showPatientCard && 'block') || 'none'}}>
                {this.getPatientCard(this.state.patientId)}
            </div>
            <button onClick={this.sendData.bind(this)}>Update Data</button>
        </div>;
    }
}
export default DocForm;
