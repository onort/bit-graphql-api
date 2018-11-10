require("dotenv").config()
const cookieParser = require("cookie-parser")
const createServer = require("./createServer")

const server = createServer()

server.express.use(cookieParser())

// pass object to start function
// { cors: { credentials: true, origin: process.env.FRONTEND_URL }}

server.start(opts => console.log(`Server running on port: ${opts.port}`))
