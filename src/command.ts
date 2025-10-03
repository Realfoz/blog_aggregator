import { setUser } from "./config";


export type CommandHandler = (
    cmdName: string,
     ...args: string[]) => void; // command handler type

export type CommandsRegistry = Record<string, CommandHandler>


export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0 || args.length >= 2) {
        throw new Error(
            `Please include a valid username`
        )
    }     
    setUser(args[0])
    console.log(`Logged in as ${args[0]}`)
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    if (cmdName in registry) {
        throw new Error(
            `${cmdName} is already registered as a command`
        )
    }
    registry[cmdName] = handler
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`${cmdName} is not a valid command`);
  }
  handler(cmdName, ...args); 
}