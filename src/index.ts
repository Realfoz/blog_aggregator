import { setUser } from "./config";
import { readConfig } from "./config";

function main() {
  setUser("Foz")
  console.log(readConfig())
}

main();