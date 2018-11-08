const { Prisma } = require("prisma-binding")

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: process.env.PRISMA_SECRET,
  debug: false
})

module.exports = db
