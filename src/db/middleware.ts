import { readConfig } from "src/config";
import { getUser, User } from "./queries/users";
import { CommandHandler } from "src/command";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn =
  (handler: UserCommandHandler): CommandHandler =>
    async (cmdName, ...args) => { //higher order functions confuse the shit out of me...
        const { currentUserName } = readConfig();
        if (!currentUserName) throw new Error("Please log in first");

        const user = await getUser(currentUserName);
        if (!user) throw new Error(`User ${currentUserName}`);

        await handler(cmdName, user, ...args);
  };

export async function getUserUUID(){ //might be getting replaced, currently think it can stay for now but its on the list 
    const userConfig = readConfig()
        if (!userConfig.currentUserName) {
            throw new Error(
                `Please register a user or log in to continue`
            )
        }
        const userData = await getUser(userConfig.currentUserName)
        if (!userData) {
        throw new Error("User not found. Please register or log in.");
        }
        const userUUID = userData.id
        return userUUID;
}