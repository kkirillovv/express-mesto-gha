// const urlRegExp = /^(http|https):\/\/(?:www\.)\S+\.\S+$/i
const emailRegExp = /^\S+@\S+\.\S+$/i
const urlRegExp = /^(http|https):\/\/[^ "]+$/

module.exports = { urlRegExp, emailRegExp }