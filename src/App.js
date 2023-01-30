import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Navbar } from "./app/Navbar";
import { AddPostForm } from "./components/AddForm";
import { EditPostForm } from "./components/EditPost";
import { NotificationsList } from "./components/Notifications";
import Posts from "./components/Posts";
import { SinglePostPage } from "./components/SinglePost";
import { UserPage } from "./components/SingleUser";
import { UsersList } from "./components/User";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => {
              return (
                <section>
                  <AddPostForm />
                  <Posts />
                </section>
              );
            }}
          />
          <Route path="/posts/:postId/edit" component={EditPostForm} />
          <Route path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/users/" component={UsersList} />
          <Route path="/users/:userId" component={UserPage} />
          <Route path="/notifications" component={NotificationsList} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
