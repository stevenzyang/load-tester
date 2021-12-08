import { runPerfTest } from "./perfTest";
import axios from "axios";

const url = "http://localhost:8080/test"

console.log("Hitting " + url);

const RPS = [500];
const DURATION = 60;

runPerfTest(RPS, DURATION, async () => {
  return axios.post(url, "{}", {headers: {"content-type": "application/json"}});
});
