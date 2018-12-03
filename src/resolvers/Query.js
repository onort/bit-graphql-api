const { forwardTo } = require("prisma-binding")

// TODO: Clear unused endpoint
// TODO: Error handling for database operations try/catch

const Query = {
  // If your query to yoga same as the query to prsima you can forward query w/o writing query for yoga
  bit: forwardTo("db"),

  bits: forwardTo("db"),

  bitsConnection: forwardTo("db"),

  async currentUser(parent, args, ctx, info) {
    // check if userId on req exists otherwise return null (!No errors otherwise query errors out)
    if (!ctx.request.userId) return null
    return await ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    )
  },

  tag: forwardTo("db"),

  async tags(parent, args, ctx, info) {
    return await ctx.db.query.tags({}, info)
  },

  tagsConnection: forwardTo("db")
}

module.exports = Query
