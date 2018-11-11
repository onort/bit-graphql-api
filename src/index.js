require("dotenv").config()
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const createServer = require("./createServer")

const server = createServer()

server.express.use(cookieParser())

// decode JWT to extract userId from cookies.token
server.express.use((req, res, next) => {
  const { token } = req.cookies
  if (token) {
    const { userId } = jwt.verify(token, process.env.PRISMA_SECRET)
    req.userId = userId
  }
  next()
})

server.start(
  { cors: { credentials: true, origin: process.env.FRONTEND_URL } },
  opts => console.log(`Server running on port: ${opts.port}`)
)
