import { parseDuration, scrapeFeeds } from "./aggregate";
import { readConfig, setUser } from "./config";
import { createFeedFollow, getFeedFollowsForUser, unfollowFeed } from "./db/queries/feed-follows";
import { createFeed, feedURLFinder, getFeedsWithCreator, printFeed } from "./db/queries/feeds";
import { createUser, getUser, getUsers, resetUsersDB, User } from "./db/queries/users";
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
    if (userTest) { //undefined is falsy, if the user isnt found it will be undefined, this is intentional to weed out failers
        throw new Error(
            `Username taken, Please try again`
        )
    }   
    await createUser(username) // calls a query
    await setUser(username) // calls a query
    console.log(`User: ${username} has been added and logged in`)
}

export async function handlerResetUsersTable(cmdName: string) {
    await resetUsersDB()
}

export async function handlerGetUsers(cmdName: string) {
    await getUsers()
}

export async function handlerGetRSSFeed(cmdname: string, ...args: string[]) {
    if ( args.length < 1) {
        throw new Error(
            `Please include a valid timer`
        )
    }
    const timerArg = args[0]
    const parsedTimer = parseDuration(timerArg)
    const handleError = (e: unknown) => {
        console.error("scrape error:", e);
        };
    await scrapeFeeds().catch(handleError) // calls it 1st to get it going
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);}, parsedTimer); // calls it every X based on input

    await new Promise<void>((resolve) => { // this is straight magical bullshit
        process.on("SIGINT", () => {  // pretty sure its a way to interupt the program with the equivelent of a ctrl+c
        console.log("Shutting down feed aggregator..."); // should only call this if the promise resolves as a void
        clearInterval(interval); // nukes the interval to stop it from continuing to restart
        resolve(); // resolves the bungled promise so things dont fall over and grind to a hault
  });
});
};

export async function handlerAddFeed(cmdname: string, user: User, ...args: string[]) {
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
    const userUUID = userData.id // Todo: refactor with new helper function getUserUUID
    const feedData = await createFeed(userUUID, args[0], args[1])
    await createFeedFollow(userUUID, feedData.id)
    await printFeed(userData,feedData)
}

export async function handlerFollow(cmdname: string, user: User, ...args: string[]) {
    if (args.length === 0 || args.length >= 2) {
        throw new Error(
            `Please include a valid URL to follow`
        )}

    const feedURL = args[0]
    const feedData = await feedURLFinder(feedURL)
    if (!feedData) {
        throw new Error("Feed not found. Add it first with 'addfeed'")
        }
    const feedFollow = await createFeedFollow(user.id, feedData[0].id)
    console.log(`${user.name} has followed ${feedData[0].name} `)
}

export async function handlerFollowing(cmdname: string, user: User, ...args: string[]) {
    const results = await getFeedFollowsForUser(user.id)
    if (results.length === 0) {
    console.log(`No feed follows found for this user.`)
    return  // Exit gracefully, not with an error
}
    console.log(`Feeds for user: ${results[0].userName}`)
    for (let i = 0; i < results.length; i++) {
    console.log(results[i].feedName)
}
};

export async function handlerUnfollow(cmdname: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(
            `Please include a valid URL to unfollow`
        )
    }
   await unfollowFeed(user,args[0])
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

