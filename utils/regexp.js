// const urlRegExp = /^(http|https):\/\/(?:www\.)\S+\.\S+$/
const emailRegExp = /^\S+@\S+\.\S+$/
const urlRegExp = /^(http|https):\/\/(?:www\.)[^ "]+$/

module.exports = { urlRegExp, emailRegExp }