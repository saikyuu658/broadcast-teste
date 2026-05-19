import { createBrowserRouter } from "react-router-dom";
import {LoginScreen} from "./app/login";
import { SignupScree } from "./app/sigup";


export const router = createBrowserRouter([
  {path: "/", element: <LoginScreen />},
  {path: "signup", element: <SignupScree />},
]);