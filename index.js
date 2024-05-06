#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const appName = process.argv[2];

if (!appName) {
  console.error("Please provide an app name as an argument.");
  process.exit(1);
}

const currentDir = process.cwd();
const appDir = path.join(currentDir, appName);
const templateDir = path.join(__dirname, "template");

// Create the app directory
fs.ensureDirSync(appDir);

// Copy the template files to the app directory
fs.copySync(templateDir, appDir, {
  overwrite: true,
  errorOnExist: true,
});

// Rename gitignore.txt to .gitignore
fs.renameSync(
  path.join(appDir, "gitignore.txt"),
  path.join(appDir, ".gitignore")
);

// Update the package.json file with the app name
const packageJsonPath = path.join(appDir, "package.json");
const packageJson = fs.readJsonSync(packageJsonPath);
packageJson.name = appName;
fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

// Update the package-lock.json file with the app name
const packageLockJsonPath = path.join(appDir, "package-lock.json");
const packageLockJson = fs.readJsonSync(packageLockJsonPath);
packageLockJson.name = appName;
fs.writeJsonSync(packageLockJsonPath, packageLockJson, { spaces: 2 });

// Install dependencies
console.log("Installing dependencies...");
try {
  execSync("npm install", { cwd: appDir, stdio: "inherit" });
} catch (error) {
  console.error("Failed to install dependencies:", error);
  process.exit(1);
}

console.log(`Successfully created the "${appName}" app!`);
