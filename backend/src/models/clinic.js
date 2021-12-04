'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Clinic.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            image: DataTypes.TEXT,

            descriptionHTMLIntro: DataTypes.TEXT,
            descriptionMarkdownIntro: DataTypes.TEXT,

            descriptionHTMLStrength: DataTypes.TEXT,
            descriptionMarkdownStrength: DataTypes.TEXT,

            descriptionHTMLStrengthEquipment: DataTypes.TEXT,
            descriptionMarkdownStrengthEquipment: DataTypes.TEXT,

            descriptionHTMLAddLocation: DataTypes.TEXT,
            descriptionMarkdownAddLocation: DataTypes.TEXT,

            descriptionHTMLProcess: DataTypes.TEXT,
            descriptionMarkdownProcess: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'Clinic'
        }
    )
    return Clinic
}
