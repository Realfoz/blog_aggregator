import { db } from "src/db/index";
import { users } from "src/db/schema";
import { eq } from "drizzle-orm";
import { readConfig } from "src/config";

export type User = typeof users.$inferSelect; // users is the table object in schema.ts, used for easy ref of the db table

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(username: string) {
    const [result] = await 
    db.select()
        .from(users)
        .where(eq(users.name, username));
    return result;
}

export async function resetUsersDB() {
    await db.delete(users)
    const checkDB = await db.select().from(users);
    if (checkDB.length === 0) {
    console.log("Users table reset")
    process.exit(0)
} else {
    console.log(`User table has not been reset, please try again`)
    process.exit(1)
}
}

export async function getUsers() {
    const result = await db.select({
    name: users.name,
    }).from(users); // selects only user names field but is an object as {name: foz} for each, in an array

let config = readConfig()
for (let i = 0; i < result.length; i++) {
    if (result[i].name === config.currentUserName) {
    console.log(`${result[i].name} (current)`)
} else {
console.log(result[i].name)
}
}
}