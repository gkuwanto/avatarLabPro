import React from "react";
import { Graph } from "react-d3-graph";

// graph payload (with minimalist structure)

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used

const color = {
  fire: "#FF6961",
  water: "#5AACCF",
  earth: "#80C271",
  air: "#EFFC93",
};
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

// graph event callbacks

class UserGraph extends React.Component {
  constructor(props) {
    super(props);
    const dictionary = { [props.user.name]: props.user.id };
    const linkDictionary = {};
    props.user.friends.forEach((friend) => {
      dictionary[friend.name] = friend.id;
      linkDictionary[friend.name + props.user.name] = true;
      linkDictionary[props.user.name + friend.name] = true;
    });

    this.state = {
      nodes: [
        { id: props.user.name, color: color[props.user.element] },
        ...props.user.friends.map((friend) => ({
          id: friend.name,
          color: color[friend.element],
        })),
      ],
      links: [
        ...props.user.friends.map((friend) => ({
          source: props.user.name,
          target: friend.name,
        })),
      ],
      dictionary: dictionary,
      linkDict: linkDictionary,
    };
  }
  onClickNode = (nodeId) => {
    const id = this.state.dictionary[nodeId];
    const addUser = (user) => {
      const friendNodes = [];
      const friendLinks = [];

      user.friends.forEach((friend) => {
        if (!this.state.dictionary[friend.name]) {
          friendNodes.push({
            id: friend.name,
            color: color[friend.element],
          });
          this.setState({
            dictionary: {
              ...this.state.dictionary,
              [friend.name]: friend.id,
            },
          });

          if (!this.state.linkDict[user.name + friend.name]) {
            friendLinks.push({ source: user.name, target: friend.name });
            this.setState({
              linkDict: {
                ...this.state.linkDict,
                [user.name + friend.name]: true,
                [friend.name + user.name]: true,
              },
            });
          }
        }
      });

      this.setState({
        nodes: [...this.state.nodes, ...friendNodes],
      });
      this.setState({
        links: [...this.state.links, ...friendLinks],
      });
    };
    if (id in this.props.userLists) {
      addUser(this.props.userLists[id]);
    } else {
      fetch("https://avatar.labpro.dev/friends/" + id)
        .then((response) => response.json())
        .then((json) => json.payload)
        .then(addUser);
    }
  };
  render() {
    return (
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={{ nodes: this.state.nodes, links: this.state.links }}
        config={myConfig}
        onClickNode={this.onClickNode}
      />
    );
  }
}
export default UserGraph;
