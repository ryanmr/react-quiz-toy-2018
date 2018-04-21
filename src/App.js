import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import quiz from "./quiz";
import Display from "./Display";
import _ from "lodash";

class Quiz extends Component {
  getQuizlet() {
    const quizlets = quiz.questions;
    const randomIndex = _.random(0, quizlets.length);
    return quizlets[randomIndex];
  }

  render() {
    return <Display getQuizlet={this.getQuizlet} />;
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Quiz />
      </div>
    );
  }
}

export default App;
