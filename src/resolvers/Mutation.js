const Mutations = {
  async createEntry(parent, args, ctx, info) {
    // entry returns a promise
    const entry = await ctx.db.mutation.createEntry(
      {
        data: { ...args }
      },
      info
    )
    return entry
  }
}

module.exports = Mutations
