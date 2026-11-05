'use strict';

import {AllowNull, Column, DataType} from "sequelize-typescript";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('panels', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      guild_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        defaultValue: 'This panel has no description',
        type: Sequelize.TEXT
      },
      image_url: {
        allowNull: true,
        type: DataType.STRING
      },
      button_label: {
        allowNull: false,
        defaultValue: 'Create Ticket',
        type: Sequelize.STRING
      },
      welcome_message: {
        allowNull: true,
        type: Sequelize.STRING
      },
      welcome_image_url: {
        allowNull: true,
        type: DataType.STRING
      },
      max_open_tickets_per_user: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER
      },
      delete_channel_on_close: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },

      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('panels');
  }
};
