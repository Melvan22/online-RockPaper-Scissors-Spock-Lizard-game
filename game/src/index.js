import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import App from './App';
import Game from './Game';
import * as serviceWorker from './serviceWorker';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

ReactDOM.render(
    //используем роутер, так как у нас есть два варианта подключения, просто новая игра или же присоединение к игре по пригласительной ссылке
<Router>
    <div className = "Main">
    <ReactCSSTransitionGroup transitionName="animated" transitionAppear={true} transitionAppearTimeout={50000} transitionEnter={true} transitionLeave={true}>
        <Route exact path="/" component={App} />
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup transitionName="animated" transitionAppear={true} transitionAppearTimeout={50000} transitionEnter={true} transitionLeave={true}>
        <Route path="/invite/:room" component={Game} /> 
        </ReactCSSTransitionGroup>
    </div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
