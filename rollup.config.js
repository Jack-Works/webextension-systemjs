import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import ts from "@rollup/plugin-typescript"

const plugins = [
    resolve({ browser: true }),
    commonjs({}),
    ts({ noEmitOnError: false }),
]
export default [
    {
        input: "src/background-script.ts",
        output: {
            file: "./background-script.js",
            format: "iife",
            sourcemap: true,
        },
        plugins,
    },
    {
        input: "src/content-script.ts",
        output: {
            file: "./content-script.js",
            format: "iife",
            sourcemap: true,
        },
        plugins,
    },
]
