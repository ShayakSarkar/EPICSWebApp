import React from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './components/login_signup_page/Form';
import HospForm from './components/hosp_details_page/HospForm';
import DocForm from './components/doc_form_page/DocForm';
import {BrowserRouter as Router,
  Switch,
  Link,
  Route  
} from 'react-router-dom';

class App extends React.Component{
  render(){
    return <Router>
      <Switch>
        <Route exact path={['/login','/doc_login']}>
          <Form/>
        </Route>
        <Route exact path='/hosp_form'>
          <HospForm/>
        </Route>
        <Route exact path='/doc_form'>
          <DocForm/>
        </Route>
      </Switch>
    </Router>
  }
}
export default App;