const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const files = [
  {
    source: ".env.example",
    target: ".env",
  },
  {
    source: "frontend/.env.example",
    target: "frontend/.env",
  },
];

for (const file of files) {
  const source = path.join(rootDir, file.source);
  const target = path.join(rootDir, file.target);

  if (!fs.existsSync(source)) {
    console.log(`Skipping: ${file.source} does not exist.`);
    continue;
  }

  if (fs.existsSync(target)) {
    console.log(`Skipping: ${file.target} already exists.`);
    continue;
  }

  fs.copyFileSync(source, target);

  console.log(`Created: ${file.target}`);
}

console.log("Environment setup completed.");