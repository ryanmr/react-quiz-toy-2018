import React, { Component } from "react";
import delay from "delay";
import _ from "lodash";

class Display extends React.Component {
  state = {
    prompt: "?",
    options: [],
    showAnswer: false
  };

  async componentDidMount() {
    while (true) {
      this.setState({
        showAnswer: false
      });
      const quizlet = this.props.getQuizlet();
      console.log(quizlet);

      const falseOptions = quizlet.options.map(option => ({
        value: option,
        answer: false
      }));
      const items = [...falseOptions, { value: quizlet.answer, answer: true }];
      const shuffledItems = _.shuffle(items);
      console.log(items);

      this.setState({
        prompt: quizlet.prompt,
        options: shuffledItems
      });

      await delay(5000);

      this.setState({
        showAnswer: true
      });

      await delay(5000);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="prompt">{this.state.prompt}</div>
        <div className="options">
          {this.state.options.map(({ value, answer }) => (
            <div
              className="option item"
              key={value}
              style={{
                ...(this.state.showAnswer && answer
                  ? styles.rightAnswer
                  : undefined),
                ...(this.state.showAnswer && !answer
                  ? styles.wrongAnswer
                  : undefined)
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const styles = {
  rightAnswer: {
    backgroundColor: "#00f",
    color: "#fff"
  },
  wrongAnswer: {
    opacity: 0.75
  }
};

export default Display;
