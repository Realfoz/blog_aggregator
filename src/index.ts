import { handlerLogin, registerCommand, CommandsRegistry, CommandHandler, runCommand } from "./command";


const registry: CommandsRegistry = {}; // declaired out of main func for scope

function main() {

registerCommand(registry, "login", handlerLogin)

const input = process.argv.slice(2);
  if (input.length < 1) {
    console.error("not enough arguments");
    process.exit(1);
  }
  
  const [cmdName, ...args] = input;
try {  
runCommand(registry,cmdName, ...args)
} catch (err: any) {
  console.error(err.message ?? String(err));
  process.exit(1);
}

}
main();