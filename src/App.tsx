import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import Recipes from "./components/Recipes";
import ShoppingList from "./components/ShoppingList";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  Redirect,
} from "react-router-dom";

function App() {
  const [currentPage, setCurrentPage] = useState("/recipes" as string);
  return (
    <div className="App">
      <header className="App-header">
        <>
          <Router>
            <Navbar className="p-0" bg="light" variant="light">
              <Container>
                <Navbar.Brand className="text-secondary" href="/">
                  Recipe Book
                </Navbar.Brand>
                <Nav className="mr-auto">
                  <NavLink
                    className="p-3 text-secondary bg-light"
                    onClick={() => setCurrentPage("/recipes")}
                    to="/recipes"
                  >
                    Recipes
                  </NavLink>
                  <NavLink
                    className="p-3 text-secondary bg-light"
                    onClick={() => setCurrentPage("/shopping-list")}
                    to="/shopping-list"
                  >
                    Shopping List
                  </NavLink>
                </Nav>
              </Container>
            </Navbar>

            <Switch>
              <Redirect exact from="/" to="/recipes" />
              <Route path="/recipes">
                <Recipes />
              </Route>
              <Route path="/shopping-list">
                <ShoppingList/>
              </Route>
            </Switch>
          </Router>
        </>
      </header>
    </div>
  );
}

export default App;
