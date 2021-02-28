const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        if (!args[0]) {
            let e2 = new MessageEmbed()
                .setDescription(`Please make sure to ping the user. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setTimestamp()
            message.channel.send(e2).then(msg => msg.delete({ timeout: 10000 }));
        } else {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) {
                let e3 = new MessageEmbed()
                    .setDescription(`I was not able to find the user you mentioned. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                message.channel.send(e3).then(msg => msg.delete({ timeout: 10000 }));
            } else {
                let payamount = args[1];
                if (!payamount) {
                    let e4 = new MessageEmbed()
                        .setDescription(`Please make sure to input a price. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                        .setColor(config.embed.color)
                        .setFooter(config.embed.footer)
                        .setTimestamp()
                    message.channel.send(e4).then(msg => msg.delete({ timeout: 10000 }));
                } else {
                    if (isNaN(payamount)) {
                        let e5 = new MessageEmbed()
                            .setDescription(`Please make sure the price is a number. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                            .setTimestamp()
                        message.channel.send(e5).then(msg => msg.delete({ timeout: 10000 }));
                    } else {
                        if (payamount <= 1) {
                            let e = new MessageEmbed()
                                .setDescription(`The number cannot be below 1. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                                .setColor(config.embed.color)
                                .setFooter(`Made by NAT2K15`)
                            message.channel.send(e).then(msg => msg.delete({ timeout: 10000 }));
                        } else {
                            let email = args[2];
                            if (!email) {
                                let e7 = new MessageEmbed()
                                    .setDescription(`Please make sure to input an email. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                                    .setColor(config.embed.color)
                                    .setFooter(config.embed.footer)
                                message.channel.send(e7).then(msg => msg.delete({ timeout: 10000 }));
                            } else {
                                let des = args.slice(3).join(` `);
                                if (!des) {
                                    let e6 = new MessageEmbed()
                                        .setDescription(`Please make sure to include a description of the product. Use \`${config.prefix}${module.exports.help.name} (<@member>) (price) (email) (Description of the product)\``)
                                        .setColor(config.embed.color)
                                        .setFooter(config.embed.footer)
                                        .setTimestamp()
                                    message.channel.send(e6).then(msg => msg.delete({ timeout: 10000 }));
                                } else {
                                    let create_invoice_json = {
                                        "merchant_info": {
                                            "email": config.paypal_info.email,
                                            "business_name": message.guild.name,
                                        },
                                        "billing_info": [{
                                            "email": email
                                        }],
                                        "items": [{
                                            "name": des,
                                            "quantity": 1.0,
                                            "unit_price": {
                                                "currency": "USD",
                                                "value": payamount
                                            }
                                        }],
                                        "note": config.paypal_info.tos,
                                        "payment_term": {
                                            "term_type": "NET_45"
                                        },
                                        "tax_inclusive": false,
                                        "total_amount": {
                                            "currency": "USD",
                                            "value": "500.00"
                                        }
                                    };

                                    client.paypal.invoice.create(create_invoice_json, function(error, invoice) {
                                        if (error) {
                                            console.log(error)
                                            let e2 = new MessageEmbed()
                                                .setTitle(`${message.guild.name} || PayPal Error`)
                                                .setDescription(`There was an error making the invoice. You have either inputed an invaild email. Also make sure your client and secret are correct.If the issue is still on going contact NAT2K15 for help. [Support server](https://discord.gg/RquDVTfDwu)`)
                                                .setColor(config.embed.color)
                                                .setFooter(config.embed.footer)
                                                .setTimestamp()
                                            message.channel.send(e2).then(msg => msg.delete({ timeout: 250000 }))

                                        } else {
                                            let invoiceId = invoice.id;
                                            client.paypal.invoice.send(invoiceId, function(error, rv) {
                                                if (error) {
                                                    console.log(error.response);
                                                } else {
                                                    console.log("Send Invoice Response");
                                                    connection.query(`INSERT INTO paypalbot (discordID, discordTag, descriptions, amount, dateofthepayment, payer_id, email, orderstatus, channel) VALUES ('${member.id}', '${member.user.tag}', '${des}', '${payamount}', '${new Date()}', '${invoice.id}', '${email}', 'Not Paid', '${message.channel.id}')`)
                                                    let e1 = new MessageEmbed()

                                                    .setTitle(`Payment system | ${message.guild.name}`)
                                                        .addField(`Product`, des, true)
                                                        .addField(`Amount Due`, payamount, true)
                                                        .addField(`Currency`, `USD`, true)
                                                        .addField(`Invoice ID`, `\`${invoice.id}\``, true)
                                                        .addField(`Link`, `[Pay Here](https://paypal.com/invoice/payerView/details/${invoice.id})`, true)
                                                        .setThumbnail(config.embed.logo)
                                                        .setColor(config.embed.color)
                                                        .setFooter(config.embed.footer)
                                                        .setTimestamp()
                                                    message.channel.send(e1);
                                                }
                                            });
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports.help = {
    name: "createinvoice",
    category: "Photo",
    aliases: [],
    description: "This will send you an invoice"
}