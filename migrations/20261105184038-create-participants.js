'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ticket_participants', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      ticket_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'tickets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      added_by: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      added_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      removed_at: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('ticket_participants');
  }
};
