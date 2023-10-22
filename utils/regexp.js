const urlRegExp = /^(http|https):\/\/(www\.)?\S+\.\S+$/
// /https?:\/\/(www\.)?[\w-]+(\.\w+)+([/\w-._~:?#[\]@!$&'()*+,;=]+)?#?/;
const emailRegExp = /^\S+@\S+\.\S+$/

module.exports = { urlRegExp, emailRegExp }