const {
    Client,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Modal,
    TextInputComponent,
} = require("discord.js");
const settings = require("./config");

/**
 *
 * @param {Client} client
 * @param {settings} settings
 */
module.exports = async (client, settings) => {
    // code

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            switch (interaction.commandName) {
                case "setup":
                    {
                        let applyChannel = interaction.guild.channels.cache.get(
                            settings.applyChannel
                        );
                        if (!applyChannel) return;

                        let btnrow = new MessageActionRow().addComponents([
                            /* new MessageButton()
                               .setStyle("PRIMARY")
                               .setCustomId("ap_ping")
                               .setLabel("Ping me !!")
                               .setEmoji("📶"),*/
                            new MessageButton()
                                .setStyle("SUCCESS")
                                .setCustomId("ap_apply")
                                .setLabel("Apply")
                                .setEmoji("📑"),
                        ]);
                        applyChannel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLURPLE")
                                    .setTitle(`${interaction.guild.name}`)
                                    .setDescription(
                                        `> Please click on the apply button to begin the application.`)
                                    .setFooter(`Developer Applications`)
                                ,
                            ],
                            components: [btnrow],
                        });

                        interaction.reply({
                            content: `> Setup in ${applyChannel}`,
                        });
                    }
                    break;
                case "ping":
                    {
                        interaction.reply({
                            content: `Bot's ping: ${client.ws.ping}`,
                            ephemeral: true,
                        });
                    }
                    break;
                case "picture":
                    {
                        interaction.reply({
                            content: `picture xd`,
                            ephemeral: true,
                        })
                    }
                default:
                    interaction.reply({
                        content: `Command not found:  **${interaction.commandName}**`,
                        ephemeral: true,
                    });
                    break;
            }
        }

        // for buttons
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case "ap_ping":
                    {
                        interaction.reply({
                            content: `i am working , now you can apply`,
                            ephemeral: true,
                        });
                    }
                    break;

                case "ap_apply":
                    {
                        let application_modal = new Modal()
                            .setTitle(`Application System`)
                            .setCustomId(`application_modal`);

                        const user_name = new TextInputComponent()
                            .setCustomId("ap_username")
                            .setLabel(`What is your real name?`.substring(0, 45))
                            .setMinLength(4)
                            .setMaxLength(50)
                            .setRequired(true)
                            .setPlaceholder(`Please type your first and last name`)
                            .setStyle("SHORT");

                        const user_why = new TextInputComponent()
                            .setCustomId("ap_userwhy")
                            .setLabel(`Why you are applying for staff?`.substring(0, 45))
                            .setMinLength(4)
                            .setMaxLength(100)
                            .setRequired(true)
                            .setPlaceholder(`Share with us why you would like to join our team`)
                            .setStyle("PARAGRAPH");

                        const user_experience = new TextInputComponent()
                            .setCustomId("ap_user_experience")
                            .setLabel(`What previous experience do you carry?`.substring(0, 45))
                            .setMinLength(4)
                            .setMaxLength(100)
                            .setRequired(true)
                            .setPlaceholder(`Share your work experience/volunteer experience`)
                            .setStyle("PARAGRAPH");

                        let row_username = new MessageActionRow().addComponents(user_name);
                        let row_userwhy = new MessageActionRow().addComponents(user_why);
                        let row_userexperience = new MessageActionRow().addComponents(user_experience);

                        application_modal.addComponents(row_username, row_userwhy, row_userexperience);

                        await interaction.showModal(application_modal);
                    }
                    break;
                case "ap_accept":
                    {
                        let embed = new MessageEmbed(
                            interaction.message.embeds[0]
                        ).setColor("GREEN");

                        interaction.message.edit({
                            embeds: [embed],
                            components: [],
                        });

                        let ap_user = interaction.guild.members.cache.get(
                            embed.footer.text
                        );

                        ap_user.send(`**Congratulations  **  🎉\n The application you submitted to become a Developer was accepted!\n Please join our Staff server: https://discord.gg/cVGv2Ttx5F\n The executive management team will soon give you your roles upon joining. `).catch(e => { })

                        await interaction.member.roles.add(settings.helperrole).catch(e => { })
                        await interaction.member.roles.remove(settings.waitingrole).catch(e => { })
                    }
                    break;
                case "ap_reject":
                    {
                        let embed = new MessageEmbed(
                            interaction.message.embeds[0]
                        ).setColor("RED");

                        interaction.message.edit({
                            embeds: [embed],
                            components: [],
                        });

                        let ap_user = interaction.guild.members.cache.get(
                            embed.footer.text
                        );

                        ap_user.send(`We're sorry to say this... But, your application for Developer was denied.`).catch(e => { })
                        await interaction.member.roles.remove(settings.waitingrole).catch(e => { })
                    }
                    break;
                default:
                    break;
            }
        }

        // for modals
        if (interaction.isModalSubmit()) {
            let user_name = interaction.fields.getTextInputValue("ap_username");
            let user_why = interaction.fields.getTextInputValue("ap_userwhy");
            let user_experience = interaction.fields.getTextInputValue("ap_user_experience");

            let finishChannel = interaction.guild.channels.cache.get(
                settings.finishChannel
            );
            if (!finishChannel) return;
            let btnrow = new MessageActionRow().addComponents([
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("ap_accept")
                    .setLabel("Accept")
                    .setEmoji("✅"),
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("ap_reject")
                    .setLabel("Reject")
                    .setEmoji("❌"),
            ]);

            finishChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor("BLURPLE")
                        .setTitle(`Application From ${interaction.user.tag}`)
                        .setDescription(
                            `${interaction.user} <t:${Math.floor(Date.now() / 1000)}:R>`
                        )
                        .addFields([
                            {
                                name: `What is your name?`,
                                value: `> ${user_name}`,
                            },
                            {
                                name: `Why do you want to join staff?`,
                                value: `> ${user_why}`,
                            },
                            {
                                name: `What previous experience do you carry?`,
                                value: `> ${user_experience}`,
                            },
                        ])
                        .setFooter({
                            text: `${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        }),
                ],
                components: [btnrow],
            });

            interaction.reply({
                content: `Good job! You're application has been submitted for review. Please give us a few days/weeks to review your application.`,
                ephemeral: true,
            });

            await interaction.member.roles.add(settings.waitingrole).catch(e => { })
        }
    });
};
