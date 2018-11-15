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

  async createTag(parent, args, ctx, info) {
    const { name, metaDescription, metaTitle } = args
    const tag = { name, metaDescription, metaTitle }
    const newTag = await ctx.db.mutation.createTag({ data: { ...tag } }, info)
    return newTag
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
      // secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    return user
  },

  async signIn(parent, args, ctx, info) {
    let { email, password } = args
    const user = await ctx.db.query.user({
      where: { email: email.toLowerCase() }
    })
    if (!user) throw new Error(`No user found for email: ${email}`)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error(`Invalid password.`)
    const token = jwt.sign({ userId: user.id }, process.env.PRISMA_SECRET)
    ctx.response.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    return user
  },

  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie("token")
    return { message: "Signout successful." }
  }
}

module.exports = Mutations
