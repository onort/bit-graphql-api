const getTagConnections = (tags, tagIds) => {
  let addedTags = []
  let removedTags = []
  let result = {}
  const exisitingTagIds = tags.map(tag => tag.id)
  tagIds.forEach(tagId => {
    const existingTag = exisitingTagIds.find(t => t === tagId)
    if (!existingTag) addedTags.push(tagId)
  })
  exisitingTagIds.forEach(exisitingTagId => {
    const removedTag = tagIds.find(t => t === exisitingTagId)
    if (!removedTag) removedTags.push(exisitingTagId)
  })
  if (addedTags.length === 0 && removedTags.length === 0) return null
  if (addedTags.length > 0)
    result.connect = addedTags.map(tagId => ({ id: tagId }))
  if (removedTags.length > 0)
    result.disconnect = removedTags.map(tagId => ({ id: tagId }))
  return result
}

module.exports = { getTagConnections }
