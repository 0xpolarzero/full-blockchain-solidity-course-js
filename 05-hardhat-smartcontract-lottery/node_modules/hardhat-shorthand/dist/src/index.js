#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const child_process_1 = require("child_process");
async function main() {
    let pathToHardhat;
    try {
        pathToHardhat = require.resolve("hardhat/internal/cli/cli.js", {
            paths: [process.cwd()],
        });
    }
    catch (e) {
        if (e.code === "MODULE_NOT_FOUND") {
            console.error("You are not inside a Hardhat project, or Hardhat is not locally installed");
        }
        else {
            console.error(`[hh] Unexpected error: ${e.message}`);
        }
        process.exit(1);
    }
    const { status } = child_process_1.spawnSync("node", [pathToHardhat, ...process.argv.slice(2)], {
        stdio: "inherit",
    });
    process.exitCode = status !== null && status !== void 0 ? status : 0;
}
exports.main = main;
main()
    .then(() => process.exit(process.exitCode))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map