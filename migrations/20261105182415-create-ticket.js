'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      guild_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      panel_id: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'panels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      channel_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      creator_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      subject: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        defaultValue: 'open',
        type: Sequelize.ENUM('open', 'claimed', 'on_hold', 'closed')
      },
      claimed_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      claimed_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      on_hold_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      on_hold_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      on_hold_reason: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      closed_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      closed_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      close_reason: {
        allowNull: true,
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
    await queryInterface.dropTable('tickets');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tickets_status";');
  }
};
