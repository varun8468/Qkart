import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://qkart-varun.herokuapp.com/api/v1`,
};

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/thanks" component={Thanks} />
    </Switch>

    // <div className="App">
    //   {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
    //       <Register />
    //       <Login/>
    // </div>
  );
}

export default App;
