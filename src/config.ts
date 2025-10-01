import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
dbUrl: string;
currentUserData?: string;
};

export function readConfig(): Config {
    // gets the file path
    // takes the contents 
    //validates it as a config type
    //returns it
};

export function setUser(userName: string): void {
    // steps 1: check for current file
    // step 2: if the file is not found, make one
    //step 3: write the user data into the file
    const filePath = getConfigFilePath();

};


function getConfigFilePath(): string {
  const filePath = path.join(os.homedir(), ".gatorconfig.json");

  if (!fs.existsSync(filePath)) {
    const initData = {
      db_url: "",
    };
    fs.writeFileSync(filePath, JSON.stringify(initData, null, 2), { encoding: "utf-8" });
  }

  return filePath;
};

function writeConfig(cfg: Config): void {
    // step 1: locate the file from the getconfigfilepath 
    //step 2: add a currentUserName key and the current user
};

function validateConfig(raw: any): Config {
    //makes damn sure its the right type when read/writeing
};