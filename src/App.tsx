import "./App.css";

import * as React from "react";

import useConfig from "./components/useConfig";
import RosterHelper from "./RosterHelper.js";

export default function App() {
  const config = useConfig();
  return (
    <RosterHelper/>
  );
}
