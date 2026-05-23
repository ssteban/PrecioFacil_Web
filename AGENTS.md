# AGENT GUIDANCE FOR PrecioFacil_Web

This document provides essential context for OpenCode sessions to quickly onboard and avoid common pitfalls.

## Project Overview
This is an Angular CLI project (version 21.1.3).

## Key Developer Commands

*   **Start Development Server:** `ng serve`
    *   Access at: `http://localhost:4200/`
    *   Automatically reloads on source file changes.
*   **Build Project:** `ng build`
    *   Build artifacts are stored in the `dist/` directory.
    *   Defaults to a production optimized build.
*   **Run Unit Tests:** `ng test`
    *   Uses Vitest as the test runner.
*   **Run End-to-End Tests:** `ng e2e`
    *   Note: This project does not include a default e2e testing framework; one needs to be configured if e2e tests are to be run.
*   **Serve SSR (Server-Side Rendering) Application:** `node dist/PrecioFacil_Web/server/server.mjs`
*   **Generate Code (Scaffolding):** `ng generate component component-name`
    *   Use `ng generate --help` to see all available schematics (components, directives, pipes, etc.).

## Conventions and Tooling

*   **Code Formatting:** Prettier is configured for code formatting.
    *   `printWidth`: 100
    *   `singleQuote`: true
    *   HTML files use the `angular` parser.
*   **Package Manager:** `npm` (specifically `npm@11.6.2`).

## Important Notes

*   **Directory Structure:** This project appears to have a relatively flat structure at the root, with Angular-specific files and directories.
