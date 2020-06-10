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
          className="form"
          style={{ margin: "0 10px" }}
          onSubmit={this.search}
        >
          <TextField
            id="outlined-full-width"
            placeholder="Input your query here"
            style={{
              width: "100%",
              margin: "20px",
            }}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            style={{
              height: "60px",
              margin: "10px",
            }}
          >
            Search
          </Button>
        </form>
        <div className="container">
          {this.state.user ? (
            <UserGraph
              user={this.state.user}
              userLists={this.state.userLists}
            />
          ) : null}
        </div>
        <p
          style={{
            margin: "10px",
          }}
        >
          <span style={{ color: "#5AACCF", backgroundColor: "lightgray" }}>
            Water.&nbsp;
          </span>
          <span style={{ color: "#80C271", backgroundColor: "lightgray" }}>
            Earth.&nbsp;
          </span>
          <span style={{ color: "#FF6961", backgroundColor: "lightgray" }}>
            Fire.&nbsp;
          </span>
          <span style={{ color: "#EFFC93", backgroundColor: "lightgray" }}>
            Air.&nbsp;
          </span>
          My grandmother used to tell me stories about the old days, a time of
          peace when the Avatar kept balance between the Water Tribes, Earth
          Kingdom, Fire Nation, and Air Nomads. But that all changed when the
          Fire Nation attacked. Only the Avatar mastered all four elements. Only
          he could stop the ruthless firebenders. But when the world needed him
          most, he vanished. A hundred years have passed and the Fire Nation is
          nearing victory in the War. Two years ago, my father and the men of my
          tribe journeyed to the Earth Kingdom to help fight against the Fire
          Nation, leaving me and my brother to look after our tribe. Some people
          believe that the Avatar was never reborn into the Air Nomads, and that
          the cycle is broken. But I haven't lost hope. I still believe that
          somehow, the Avatar will return to save the world.
        </p>
      </div>
    );
  }
}

export default App;
