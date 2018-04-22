import React, { Component } from "react";
import {
  Spring,
  Trail,
  Transition,
  Keyframes,
  animated,
  config
} from "react-spring";
import delay from "delay";
import _ from "lodash";

class Display extends React.Component {
  state = {
    prompt: "?",
    answer: "",
    options: [],
    items: []
  };

  async componentDidMount() {
    // Since the script prop basically just receives the animation function we can
    // pick it up and use it elsewhere, that makes it possible to combine several of them
    // even though they belong to different elements, they can wait for one another, etc.
    // And again, since we are using the native prop none of this causes re-rendering
    while (true) {
      const quizlet = this.props.getQuizlet();
      console.log(quizlet);

      const falseOptions = quizlet.options.map(option => ({
        value: option,
        answer: false
      }));
      const items = [
        ...falseOptions,
        { value: quizlet.answer, answer: true }
      ].map(v => {
        v.toString = () => v.value;
        return v;
      });
      const shuffledItems = _.shuffle(items);
      console.log(items);

      this.setState({
        prompt: quizlet.prompt,
        items: shuffledItems
      });

      // set state will cause an render update
      // but it will cause the animation to jitter
      await delay(1000);

      this.container(Spring, {
        from: { x: -100 },
        to: { x: 0 },
        config: config.slow
      });
      await delay(1000);
      await this.prompt(Spring, {
        from: { x: -120, opacity: 0 },
        to: { x: 0, opacity: 1 }
      });

      this.content(Trail, {
        from: { x: -120, opacity: 0 },
        to: { x: 0, opacity: 1 }
      });
      await delay(100);
      await this.answer(Spring, {
        immediate: true,
        to: { opacity: 1 }
      });

      await delay(4 * 1000);

      await this.answer(Spring, {
        from: {
          backgroundColor: "#6154d8",
          color: "#ececec",
          border: "5px solid rgba(255,255,255,0)"
        },
        to: {
          backgroundColor: "#4732ff",
          color: "#fff",
          border: "5px solid rgba(255,255,255,1)"
        },
        config: config.slow
      });

      await delay(4 * 1000);

      await this.content(Trail, { to: { x: -120, opacity: 0 } });

      await this.container(Spring, { to: { x: -100 }, config: config.slow });
    }
  }

  render() {
    return (
      <Keyframes native script={next => (this.container = next)}>
        {({ x }) => (
          <animated.div
            className="container"
            style={{ transform: x.interpolate(x => `translate3d(${x}%,0,0)`) }}
          >
            <Keyframes native script={next => (this.prompt = next)}>
              {({ x }) => (
                <animated.div
                  className="prompt"
                  style={{
                    transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                  }}
                >
                  {this.state.prompt}
                </animated.div>
              )}
            </Keyframes>
            <Keyframes
              native
              keys={this.state.items}
              script={next => (this.content = next)}
            >
              {this.state.items.map(item => ({ x, ...props }) => {
                const { answer } = item;
                if (answer) {
                  return (
                    <Keyframes native script={next => (this.answer = next)}>
                      {({ ...answerProps }) => {
                        return (
                          <animated.div
                            className="item"
                            style={{
                              transform: x.interpolate(
                                x => `translate3d(${x}%,0,0)`
                              ),
                              ...answerProps
                            }}
                          >
                            {item.value}
                          </animated.div>
                        );
                      }}
                    </Keyframes>
                  );
                }
                return (
                  <animated.div
                    className="item"
                    style={{
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                      ...props
                    }}
                  >
                    {item.value}
                  </animated.div>
                );
              })}
            </Keyframes>
          </animated.div>
        )}
      </Keyframes>
    );
  }
}

export default Display;
