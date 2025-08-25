import { marked } from 'marked'
const makeHtml = marked.parse.bind(marked)
export default makeHtml
