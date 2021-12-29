var fs = require("fs");

fs.copyFile(
  "build/contracts/Main.json",
  "../src/contracts/Main.json",
  (err) => {
    if (err) throw err;
    console.log("✅ Your contract's ABI was copied to the frontend");
  }
);
