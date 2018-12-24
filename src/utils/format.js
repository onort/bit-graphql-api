const convertFromRaw = require("draft-js").convertFromRaw
const draftjsToHTML = require("draft-js-export-html")

const convertEditorStateString = editorStateString => {
  if (!editorStateString) return { contentHTML: "", contentText: "" }
  const editorState = convertFromRaw(JSON.parse(editorStateString))
  const contentText = editorState.getPlainText()
  const contentHTML = draftjsToHTML.stateToHTML(editorState).replace(/\n/g, "")
  return { contentHTML, contentText }
}

const stringToSlug = text => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/-+/g, "-") // collapse dashes
    .replace(/[^\w-]+/g, "") // remove non-alphanumeric
}

module.exports = { convertEditorStateString, stringToSlug }
