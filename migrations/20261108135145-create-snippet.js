'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('snippets', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      guild_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('snippets');
  }
};
