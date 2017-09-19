#Branches
* **master**        - Pure node application
* **websocket**     - WebSocket (Socket.IO), action based node server

# Dependency
1. Node JS version 6.9.2 or greater
2. NodeInspector

    Install ``node-inspector`` to be able to use debugging
    ```bash
    npm install -g node-inspector
    ```

# Usage
```bash
npm run up:src
```
Up for development from ``./src/app/``

```bash
npm run test
```
Execute tests from ``./src/test/`` once with eslint and coverage report

```bash
npm run test:watch
```
Start tests from ``./src/test/`` with mocha in watch mode

```bash
npm run debug:dist
```
Build application and start code from ``./build/dist/`` in debugger

```bash
npm run build:dist
```
Build distribution bundle in ``./build/dist``
