#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const appName = process.argv[2];
const optionalArgs = process.argv.slice(3); // Get all optional arguments

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

// Update the package.json file with the app name and optional dependencies
const packageJsonPath = path.join(appDir, "package.json");
const packageJson = fs.readJsonSync(packageJsonPath);
packageJson.name = appName;

packageJson.dependencies = {
  react: "*", // Latest version of React
  "react-dom": "*", // Latest version of react-dom
  "react-scripts": "*", // Specific version of react-scripts
};

// Handle optional dependencies
optionalArgs.forEach((arg) => {
  const [dependency, version] = arg.split("@");

  switch (dependency) {
    case "-fer":
      packageJson.dependencies["react-router-dom"] = "*";
      packageJson.dependencies["bootstrap"] = "*";
      packageJson.dependencies["react-bootstrap"] = "*";
      // Define the path to the index.js file inside the src folder of the template directory
      const indexFilePathFer = path.join(appDir, "src", "index.js");

      // Read the content of the index.js file
      let indexFileContentFer = fs.readFileSync(indexFilePathFer, "utf8");

      // Define the import statement for Bootstrap
      const bootstrapImportStatementFer =
        "import 'bootstrap/dist/css/bootstrap.min.css';";

      // Define a regular expression to match import statements
      const importRegexFer = /import .*?;(?=\n|$)/g;

      // Find all import statements in the file
      const importStatementsFer = indexFileContentFer.match(importRegexFer);

      // If there are import statements, find the last one and insert the Bootstrap import statement after it
      if (importStatementsFer) {
        const lastImportStatement =
          importStatementsFer[importStatementsFer.length - 1];
        const lastIndex =
          indexFileContentFer.lastIndexOf(lastImportStatement) +
          lastImportStatement.length;
        indexFileContentFer =
          indexFileContentFer.slice(0, lastIndex) +
          "\n" +
          bootstrapImportStatementFer +
          "\n" +
          indexFileContentFer.slice(lastIndex);
      } else {
        // If there are no import statements, just prepend the Bootstrap import statement at the beginning
        indexFileContentFer =
          bootstrapImportStatementFer + "\n" + indexFileContentFer;
      }

      // Write the modified content back to the index.js file
      fs.writeFileSync(indexFilePathFer, indexFileContentFer);

      try {
        execSync("git init", { cwd: appDir, stdio: "inherit" });
      } catch (error) {
        console.error("Failed to initialize Git repository:", error);
        process.exit(1);
      }
      break;
    case "-router":
      packageJson.dependencies["react-router-dom"] = "*";
      break;
    case "-bootstrap":
      packageJson.dependencies["bootstrap"] = "*";
      packageJson.dependencies["react-bootstrap"] = "*";
      // Define the path to the index.js file inside the src folder of the template directory
      const indexFilePath = path.join(appDir, "src", "index.js");

      // Read the content of the index.js file
      let indexFileContent = fs.readFileSync(indexFilePath, "utf8");

      // Define the import statement for Bootstrap
      const bootstrapImportStatement =
        "import 'bootstrap/dist/css/bootstrap.min.css';";

      // Define a regular expression to match import statements
      const importRegex = /import .*?;(?=\n|$)/g;

      // Find all import statements in the file
      const importStatements = indexFileContent.match(importRegex);

      // If there are import statements, find the last one and insert the Bootstrap import statement after it
      if (importStatements) {
        const lastImportStatement =
          importStatements[importStatements.length - 1];
        const lastIndex =
          indexFileContent.lastIndexOf(lastImportStatement) +
          lastImportStatement.length;
        indexFileContent =
          indexFileContent.slice(0, lastIndex) +
          "\n" +
          bootstrapImportStatement +
          "\n" +
          indexFileContent.slice(lastIndex);
      } else {
        // If there are no import statements, just prepend the Bootstrap import statement at the beginning
        indexFileContent = bootstrapImportStatement + "\n" + indexFileContent;
      }

      // Write the modified content back to the index.js file
      fs.writeFileSync(indexFilePath, indexFileContent);

      break;
    case "-git": // New case for handling the -git optional argument
      try {
        execSync("git init", { cwd: appDir, stdio: "inherit" });
      } catch (error) {
        console.error("Failed to initialize Git repository:", error);
        process.exit(1);
      }
      break;
    default:
      if (dependency && version) {
        packageJson.dependencies[dependency] = version;
      } else if (dependency) {
        packageJson.dependencies[dependency] = "*"; // No specific version
      }
      break;
  }
});

fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

// Install dependencies
console.log("Installing dependencies...");
try {
  execSync("npm install", { cwd: appDir, stdio: "inherit" });

  // Define a function to update the dependencies dynamically
  const updateDependencyVersions = () => {
    Object.keys(packageJson.dependencies).forEach((dependency) => {
      if (packageJson.dependencies[dependency] === "*") {
        const installedVersion = require(path.join(
          appDir,
          "node_modules",
          dependency + "/package.json"
        )).version;
        packageJson.dependencies[dependency] = installedVersion;
      }
    });
  };
  updateDependencyVersions();
  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
} catch (error) {
  console.error("Failed to install dependencies:", error);
  process.exit(1);
}

console.log(`Successfully created the "${appName}" app!`);
