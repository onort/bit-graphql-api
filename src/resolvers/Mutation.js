const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
  },

  async registerUser(parent, args, ctx, info) {
    const email = args.email.toLowerCase()
    // one-way hash
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          name: args.name,
          email,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    )
    // sign-in user by setting jwt as a cookie
    const token = jwt.sign({ userId: user.id }, process.env.PRISMA_SECRET)
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    return user
  }
}

module.exports = Mutations
