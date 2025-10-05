import { setUser } from "./config";
import { createUser, getUser, getUsers, resetUsersDB } from "./db/queries/users";


export type CommandHandler = (
    cmdName: string,
     ...args: string[]) => Promise<void>; // command handler type

export type CommandsRegistry = Record<string, CommandHandler>


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0 || args.length >= 2) {
        throw new Error(
            `Please include a valid username`
        )
    }
    const username = args[0]
    const userTest = await getUser(username)
    if (!userTest) { //undefined is falsy, if the user isnt found it will be undefined
        throw new Error(
            `Username not found, Please try again`
        )
    }       
    setUser(args[0])
    console.log(`Logged in as ${args[0]}`)
}

export async function handlerRegisterUser(cmdName: string, ...args: string[]) {
   // console.log("Handler called with:", cmdName, args);
    if (args.length === 0 || args.length >= 2) {
        throw new Error(
            `Please include a valid username`
        )
    }
    const username = args[0]
    const userTest = await getUser(username)
    if (userTest) { //undefined is falsy, if the user isnt found it will be undefined
        throw new Error(
            `Username taken, Please try again`
        )
    }   
    await createUser(username)
    setUser(username)
    console.log(`User: ${username} has been added and logged in`)
}

export async function handlerResetUsersTable(cmdName: string) {
    await resetUsersDB()
}

export async function handlerGetUsers(cmdName: string) {
    await getUsers()
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    if (cmdName in registry) {
        throw new Error(
            `${cmdName} is already registered as a command`
        )
    }
    registry[cmdName] = handler
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`${cmdName} is not a valid command`);
  }
  await handler(cmdName, ...args); 
}