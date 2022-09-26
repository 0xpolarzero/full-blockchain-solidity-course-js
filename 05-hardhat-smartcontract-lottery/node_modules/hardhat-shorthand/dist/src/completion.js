#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const tabtab_1 = __importDefault(require("@fvictorio/tabtab"));
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const semver_1 = __importDefault(require("semver"));
const log = debug_1.default("hh");
const REQUIRED_HARDHAT_VERSION_RANGE = ">=2.0.7";
async function main() {
    const cmd = process.argv[2];
    if (cmd === "install") {
        await tabtab_1.default
            .install({
            name: "hh",
            completer: "hardhat-completion",
        })
            .catch((err) => {
            console.error("There was a problem installing Hardhat's completion", err);
        });
        return;
    }
    if (cmd === "completion") {
        let pathToHardhatPackageJson;
        try {
            // tslint:disable-next-line no-implicit-dependencies
            pathToHardhatPackageJson = require.resolve("hardhat/package.json", {
                paths: [process.cwd()],
            });
        }
        catch (e) {
            // not inside a hardhat project
            return;
        }
        try {
            const env = tabtab_1.default.parseEnv(process.env);
            // check hh's dependency on hardhat
            const hardhatVersion = require(pathToHardhatPackageJson).version;
            const pathToHardhatAutocomplete = getRequirePathFromCwd("hardhat/internal/cli/autocomplete");
            if (!semver_1.default.satisfies(hardhatVersion, REQUIRED_HARDHAT_VERSION_RANGE) ||
                pathToHardhatAutocomplete === null) {
                await logWarningWithThrottling(`\nCouldn't get autocomplete for this project. The installed version of hh requires a hardhat version that satisfies ${REQUIRED_HARDHAT_VERSION_RANGE}, but this project uses ${hardhatVersion}`);
                return;
            }
            // check hardhat's dependency on hh
            const hhVersion = require("../../package.json").version;
            const { complete, HARDHAT_COMPLETE_FILES, REQUIRED_HH_VERSION_RANGE, } = require(pathToHardhatAutocomplete);
            if (!semver_1.default.satisfies(hhVersion, REQUIRED_HH_VERSION_RANGE)) {
                await logWarningWithThrottling(`\nCouldn't get autocomplete for this project. The version of hardhat used in this project requires an hh version that satisfies ${REQUIRED_HH_VERSION_RANGE}, but your version of hh is ${hhVersion}`);
                return;
            }
            // get and print suggestions
            const suggestions = await complete(env);
            if (Array.isArray(suggestions)) {
                return tabtab_1.default.log(suggestions);
            }
            if (suggestions === HARDHAT_COMPLETE_FILES) {
                return tabtab_1.default.logFiles();
            }
            console.error("\nCouldn't complete the command, please report this issue");
            return tabtab_1.default.log([]);
        }
        catch (e) {
            log(e.message);
            return tabtab_1.default.log([]);
        }
    }
    console.error(`Unrecognized command "${cmd}". You can install Hardhat completion with the "install" command.`);
    process.exit(1);
}
exports.main = main;
async function logWarningWithThrottling(message) {
    // we need to write a file to disk to do the throttling because zsh calls the
    // autocomplete function several times, and these are separate processes
    const pathToGlobalDirModule = getRequirePathFromCwd("hardhat/internal/util/global-dir"); // we know it exists because otherwise we would've exited earlier
    const { getCacheDir } = require(pathToGlobalDirModule);
    const globalCacheDir = await getCacheDir();
    const throttleFile = path.join(globalCacheDir, ".hh-throttle-file");
    if (fs.existsSync(throttleFile) && fileAge(throttleFile) < 5000) {
        // if the throttle file is recent, we don't do anything
        return;
    }
    console.warn(message);
    fs.writeFileSync(throttleFile, "");
}
function fileAge(file) {
    const stats = fs.statSync(file);
    return Date.now() - stats.mtimeMs;
}
function getRequirePathFromCwd(moduleToRequire) {
    try {
        const pathToRequire = require.resolve(moduleToRequire, {
            paths: [process.cwd()],
        });
        return pathToRequire;
    }
    catch (e) {
        return null;
    }
}
main()
    .then(() => process.exit(process.exitCode))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=completion.js.map