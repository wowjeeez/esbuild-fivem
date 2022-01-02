# esbuild-fivem
FiveM resource bootstrapped with esbuild and TypeScript.
Using this templat should be very straightforward, but I will explain it anyways. <br>
# Structure
`common/`: Shared libraries, can be imported from both server and client (be aware of what natives/functions you use though). <br>
`server/`: Server code using node 16 (or 12 if you didn't update your artifacts). <br>
`client/`: Client code.
# Commands
`build`: Will build the project  (production ready). <br>
`dev`: Will start esbuild in watch mode (types are still checked). <br>
