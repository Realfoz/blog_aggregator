import { readConfig, setUser } from "./config";
import { createFeed, getFeedsWithCreator, printFeed } from "./db/queries/feeds";
import { createUser, getUser, getUsers, resetUsersDB } from "./db/queries/users";
import { fetchFeed } from "./rss";


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

export async function handlerGetRSSFeed(cmdname: string, ...args: string[]) {
  const url = args[0] ?? "https://www.wagslane.dev/index.xml";
  const feed = await fetchFeed(url);
  console.log(JSON.stringify(feed, null, 2));
}

export async function handlerAddFeed(cmdname: string, ...args: string[]) {
    if ( args.length < 2) {
        throw new Error(
            `Please include a valid feed name and url`
        )
    }
    const userConfig = readConfig()
    if (!userConfig.currentUserName) {
        throw new Error(
            `Please register a user or log in to register a feed`
        )
    }
    const userData = await getUser(userConfig.currentUserName)
    if (!userData) {
    throw new Error("User not found. Please register or log in.");
    }
    const userUUID = userData.id
    const feedData = await createFeed(userUUID, args[0], args[1])
    await printFeed(userData,feedData)
}

export async function handlerGetFeeds(cmdname: string, ...args: string[]) {
    const feedsData = await getFeedsWithCreator()
    for (let i = 0; i < feedsData.length; i++) { //could do this as a map in refactor, need to figure out how to break the objects into users/feeds better
        printFeed(feedsData[i].users, feedsData[i].feeds)
    }
   
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

