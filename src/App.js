import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, BrowserRouter, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const Page = ({ title }) => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <link href="https://cdn.metroui.org.ua/v4/css/metro-all.min.css" rel="stylesheet" />
      <h2>{title}</h2>
    </div>
    <p className="App-intro">
      This is the {title} page.
    </p>
    <p>
      <Link to="/">Home</Link>
    </p>
    <p>
      <Link to="/about">About</Link>
    </p>
    <p>
      <Link to="/settings">Settings</Link>
    </p>
  </div>
);

const Home = (props) => (
  <Page title="Home"/>
);

const About = (props) => (
  <Page title="About"/>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">
                        <h1>Hello World!</h1>
                <p className="text-leader">
                    Welcome to Metro 4 for React App template!
                </p>
        <div class="container">
                <h1>Dialog demos</h1>
        
        
                        <form class="login-form bg-white p-6 mx-auto border bd-default win-shadow"
                    data-role="validator"
                    action="javascript:"
                    data-clear-invalid="2000"
                    data-on-error-form="invalidForm"
                    data-on-validate-form="validateForm">
        
                    <div data-role="tile" data-size="small"><img src="future-512.png" alt="Time is go.." /></div>
                    <h2 class="text-light">Simple contact administration</h2>
                    
        
                    <div data-role="tile" data-size="large"><img sizes="(max-width: 480px) 95vw, 25vw" src="https://metroui.org.ua/images/me.jpg" alt="Hanter Sergey Pimenov" class="place-right" />
                        <span class="branding-bar">Sergey Pimenov</span>
                        </div>
        
        
        <hr class="thin mt-4 mb-4 bg-white" />
                    <div class="form-group">
        
                        <input id="user" type="text" data-role="input" data-prepend="User name: " />
        
                        <input id="email" type="text" data-role="input" data-prepend="<span class='mif-envelop'>" placeholder="Enter your email..." data-validate="required email" />
                    </div>
        
                    <div class="row">
                        <label for="picker" >Select date:</label>
                        <input id="picker" type="text" data-role="datepicker" onchange="$('#inp2').val(this.value)" />
                        <label for="inp2">Data Birthday:</label>
                        <input type="text" id="inp2" readonly />
                    </div>        
                        
                        

                    <div class="form-group mt-10">
                        <input id="check" type="checkbox" data-role="checkbox" data-caption="Remember me" />
                    </div>
        
        <button class="button">Submit form</button>
        
                        <div class="mt-4">
                    <button class="button" onclick="timeoutDemo()">Timeout</button>
                    <button class="button" onclick="animateDemo()">Animate</button>
                    <button class="button" onclick="customsDemo()">Customs</button>
                    <button class="button" onclick="actionsDemo()">Actions</button>
                </div>
              </form>
         </div>       
        
        <div class="container">
    <h1>Table load test page</h1>

    <table
            id='table' class="table striped table-border mt-4"
            data-role="table"
            data-cls-table-top="row flex-nowrap"
            data-cls-search="cell-md-8"
            data-cls-rows-count="cell-md-4"
            data-rows="5"
            data-rows-steps="5, 10"
            data-show-activity="false"
            >
        <thead>
            <tr>
                <th data-name="User name: ">Name</th>
                <th data-name="email">Email</th>
                <th data-name="birthday">Data Birthday</th>
                <th data-name="checkbox">Remember me</th>
                <th data-name="picture">Picture</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
</div>        
        
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </div>
      </BrowserRouter>
    );
  }
}


ReactDOM.render( <App />, document.querySelector( '#root' ) );
export default App;
