import { createBrowserRouter } from "react-router-dom";
import {LoginScreen} from "./app/login";
import { SignupScree } from "./app/sigup";
import Layout from "./app/auth/layout";
import { Connections } from "./app/auth/connections";
import { Contacts } from "./app/auth/contacts";
import { NewMessage } from "./app/auth/newMessage";

export const router = createBrowserRouter([
  {path: "/", element: <LoginScreen />},
  {path: "signup", element: <SignupScree />},
  {
    path: "auth", 
    element: <Layout />,
    children : [
       {path: 'connections', element: <Connections />},
       {path: 'message/:connectionId', element: <NewMessage />},
       {path: 'contacts', element: <Contacts />},
    ]
  },
]);