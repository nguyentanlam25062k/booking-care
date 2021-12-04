'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },

            image: {
                type: Sequelize.BLOB('long')
            },
            descriptionHTMLIntro: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownIntro: {
                type: Sequelize.TEXT
            },

            descriptionHTMLStrength: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownStrength: {
                type: Sequelize.TEXT
            },

            descriptionHTMLEquipment: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownEquipment: {
                type: Sequelize.TEXT
            },

            descriptionHTMLLocation: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownLocation: {
                type: Sequelize.TEXT
            },

            descriptionHTMLProcess: {
                type: Sequelize.TEXT
            },
            descriptionMarkdownProcess: {
                type: Sequelize.TEXT
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('clinics')
    }
}
