#!/usr/bin/env node
import { CLI } from "./cli/CLI";

const ignoredParmCount = 2;
const args = process.argv.slice(ignoredParmCount);
CLI.run(args);
