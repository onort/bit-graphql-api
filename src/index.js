require("dotenv").config({ path: ".env" })
const createServer = require("./createServer")
const db = require("./db")

const server = createServer()

// pass object to start function
// { cors: { credentials: true, origin: process.env.FRONTEND_URL }}

server.start(opts => console.log(`Server running on port: ${opts.port}`))
