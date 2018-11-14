const { forwardTo } = require("prisma-binding")

const Query = {
  // If your query to yoga same as the query to prsima you can forward query w/o writing query for yoga
  entries: forwardTo("db"),
  async currentUser(parent, args, ctx, info) {
    // check if userId on req exists otherwise return null (!No errors otherwise query errors out)
    if (!ctx.request.userId) return null
    return await ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    )
  }
  // async entries(parent, args, ctx, info) {
  //   const entries = await ctx.db.query.entries()
  //   return entries
  // }
}

module.exports = Query
