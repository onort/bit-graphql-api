const { forwardTo } = require("prisma-binding")

const Query = {
  // If your query to yoga same as the query to prsima you can forward query w/o writing query for yoga
  entries: forwardTo("db")
  // async entries(parent, args, ctx, info) {
  //   const entries = await ctx.db.query.entries()
  //   return entries
  // }
}

module.exports = Query
