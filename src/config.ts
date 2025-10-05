import fs from "fs";
import os from "os";
import path from "path";


export type Config = {
dbUrl: string;
currentUserName?: string;
};


export function readConfig(): Config {
  const filePath = getConfigFilePath(); // gets the file path
  const fileData = fs.readFileSync(filePath, { encoding: "utf-8" }); // reads the file as a string

  let parsed: unknown; //sets the parsed variable out of the try/catch scope for later return and sets it to an unknown type so it must be validated before return
  try {
    parsed = JSON.parse(fileData);
  } catch (err) {
    fs.renameSync(filePath, filePath + ".bak"); // backs the file up incase something is salvageable
    throw new Error(
      `Malformed config at ${filePath}. Backed up to ${filePath}.bak. ` +
      `Fix or delete the file, then rerun.`
    );
  }

  return validateConfig(parsed);
};

export function setUser(userName: string): void {
  if (typeof userName !== "string" || userName.trim() === "") { // tidys up the username and makes sure its a string we can use
    throw new Error("userName must be a non-empty string");
  }

  const cfg = readConfig(); // gets the object as a copy
  const next: Config = { ...cfg, currentUserName: userName }; // doesnt mutate it but updates it to be passed on and written, which will do the actual changes
  writeConfig(next);
}


function getConfigFilePath(): string {
  const filePath = path.join(os.homedir(), ".gatorconfig.json"); // hard coded file name for consistent pathing to dir
  return filePath;
};

function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath()
  const onDisk = { // puts the json fields as snake_case for storage in file
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  }
  fs.writeFileSync(filePath, JSON.stringify(onDisk, null, 2), { encoding: "utf-8" });
};

function validateConfig(raw: unknown): Config {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Config must be an object"); // makes sure its an object we can do things with
  }
  const rec = raw as Record<string, unknown>; // asserts the type of the raw data as an object with fields we can access later

  const dbUrl = rec["db_url"]; // finds the snake_case db_url in the object
  if (typeof dbUrl !== "string" || dbUrl.length === 0) { 
    throw new Error("Config.db_url must be a non-empty string"); // will error if we dont have a valid dbUrl 
  }

  const cun = rec["current_user_name"]; // looks for the snake_case
  if (cun !== undefined && typeof cun !== "string") {
    throw new Error("Config.current_user_name must be a string if present"); // only errors if its not a string as per the Config type
  }

  return {
    dbUrl,
    currentUserName: cun as string | undefined, // returns the found string or undefined here
  };
}
