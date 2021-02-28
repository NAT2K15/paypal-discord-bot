const config = require('../config.json')
module.exports = async(client) => {
    setInterval(() => client.user.setActivity(` To Your BS`, { type: "LISTENING" }), 5000)
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`\x1b[91m[Made by NAT2K15] \x1b\x1b[0m`);
}