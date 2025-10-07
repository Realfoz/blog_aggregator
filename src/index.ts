import { handlerLogin, registerCommand, CommandsRegistry, CommandHandler, runCommand, handlerRegisterUser, handlerResetUsersTable, handlerGetUsers, handlerGetRSSFeed, handlerAddFeed, handlerGetFeeds } from "./command";
import { getFeedsWithCreator } from "./db/queries/feeds";


const registry: CommandsRegistry = {}; // declaired out of main func for scope

async function main() {

registerCommand(registry, "login", handlerLogin)
registerCommand(registry, "register", handlerRegisterUser)
registerCommand(registry, "reset", handlerResetUsersTable)
registerCommand(registry, "users", handlerGetUsers)
registerCommand(registry, "agg", handlerGetRSSFeed)
registerCommand(registry, "addfeed", handlerAddFeed)
registerCommand(registry, "feeds", handlerGetFeeds)


//console.log("Main started");
const input = process.argv.slice(2);
  const [cmdName, ...args] = input;
  if (input.length < 1) {
    console.error("not enough arguments");
    process.exit(1);
  }
  
try {  
await runCommand(registry,cmdName, ...args)
} catch (err: any) {
  console.error(err.message ?? String(err));
  process.exit(1);
}
process.exit(0)
}

main();