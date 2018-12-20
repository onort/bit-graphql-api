const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const convertEditorStateString = require("../utils/format")
  .convertEditorStateString
const getTagConnections = require("../utils/helpers").getTagConnections
const userPermissions = require("../constants").userPermissions

// TODO: Error handling for database operations try/catch
const Mutations = {
  async createBit(parent, args, ctx, info) {
    const {
      content,
      imageCredit,
      imageURL,
      isPublished,
      metaDescription,
      metaTitle,
      sourceCredit,
      sourceURL,
      tagIds
    } = args
    const { contentHTML, contentText } = convertEditorStateString(content)
    const userId = ctx.request.userId
    if (!userId) throw new Error("UserId is required for creating a new tag.")
    await ctx.db.mutation.createBit(
      {
        data: {
          author: { connect: { id: userId } },
          contentHTML,
          contentText,
          imageCredit,
          imageURL,
          isPublished,
          metaDescription,
          metaTitle,
          sourceCredit,
          sourceURL,
          tags: { connect: tagIds.map(tagId => ({ id: tagId })) }
        }
      },
      info
    )
    return { message: "Successfuly added bit to database." }
  },

  async createTag(parent, args, ctx, info) {
    const { name, metaDescription, metaTitle } = args
    const tag = { name, metaDescription, metaTitle }
    const userId = ctx.request.userId
    if (!userId) throw new Error("UserId is required for creating a new tag.")
    await ctx.db.mutation.createTag(
      { data: { ...tag, createdBy: { connect: { id: userId } } } },
      info
    )
    return { message: "Created tag successfully." }
  },

  async deleteBit(parent, args, ctx, info) {
    const where = { id: args.id }
    // manually passing query
    const bit = await ctx.db.query.bit({ where }, `{ id, contentText }`)
    // TODO: Check for user permissions
    if (!bit) throw new Error("No bit has been found for the given id.")
    await ctx.db.mutation.deleteBit({ where }, info)
    return { message: "Successfuly deleted bit from database." }
  },

  async deleteTag(parent, args, ctx, info) {
    const where = { id: args.id }
    // manually passing query
    const tag = await ctx.db.query.tag({ where }, `{ id, name }`)
    // TODO: Check for user permissions
    if (!tag) throw new Error("No tag has been found for the given id.")
    await ctx.db.mutation.deleteTag({ where }, info)
    return { message: "Successfuly deleted tag from database." }
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
          permissions: { set: [userPermissions.USER] }
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
  },

  async updateBit(parent, args, ctx, info) {
    const updates = { ...args }
    // deleting properties to make updates object compatible
    // with updateBit mutation on prisma
    delete updates.id
    delete updates.content
    delete updates.tagIds
    const { contentHTML, contentText } = convertEditorStateString(args.content)
    updates.contentHTML = contentHTML
    updates.contentText = contentText
    const bitBeforeUpdate = await ctx.db.query.bit(
      { where: { id: args.id } },
      `{ tags { id }}`
    )
    const tagChanges = getTagConnections(bitBeforeUpdate.tags, args.tagIds)
    if (tagChanges) updates.tags = tagChanges
    await ctx.db.mutation.updateBit(
      {
        data: { ...updates },
        where: { id: args.id }
      },
      info
    )
    return { message: "Updated bit successfully." }
  },

  async updateTag(parent, args, ctx, info) {
    const updates = { ...args }
    delete updates.id
    await ctx.db.mutation.updateTag(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    )
    return { message: "Updated tag successfully." }
  }
}

module.exports = Mutations
