import React from "react";
import UserGraph from "./components/network/network.component";
import SearchAppBar from "./components/appBar/appBar.component";
import "./App.css";

import { TextField, Button } from "@material-ui/core";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: {},
      searchTerm: "",
      visited: {},
      userLists: {},
    };
  }
  search = (e) => {
    e.preventDefault();
    this.traverse(this.state.searchTerm);
  };

  traverse = async (searchTerm, id = 1) => {
    const userList = {};
    const stack = [];
    const discovered = {};

    stack.push(id);
    while (stack.length) {
      id = stack.pop();
      if (discovered[id]) {
        continue;
      }

      discovered[id] = true;
      let payload;
      if (id in this.state.userLists) {
        payload = userList[id];
      } else {
        const res = await fetch("https://avatar.labpro.dev/friends/" + id, {
          cache: "force-cache",
        });
        const json = await res.json();
        payload = json.payload;
      }
      userList[payload.id] = payload;
      if (payload.name.includes(searchTerm)) {
        console.log(payload);
        this.setState({ user: null });
        this.setState({ user: payload });
        return;
      }
      payload.friends.forEach((friend) => {
        if (!discovered[friend.id]) {
          stack.push(friend.id);
        }
      });
    }
    this.setState({ userLists: userList });
  };
  render() {
    return (
      <div className="App">
        <SearchAppBar />
        <form
          className="container"
          style={{ margin: "0 10px" }}
          onSubmit={this.search}
        >
          <TextField
            id="outlined-full-width"
            placeholder="Input your query here"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </form>
        {this.state.user ? (
          <UserGraph user={this.state.user} userLists={this.state.userLists} />
        ) : null}
      </div>
    );
  }
}

export default App;
