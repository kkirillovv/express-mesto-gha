// const urlRegExp = /^(http|https):\/\/(?:www\.)\S+\.\S+$/i
// const emailRegExp = /^\S+@\S+\.\S+$/i
const urlRegExp = /^(http|https):\/\/[^ "]+$/
const emailRegExp = /^\S+@\S+\.\S+$/

module.exports = { urlRegExp, emailRegExp }