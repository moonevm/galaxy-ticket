'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tickets', 'close_reason', {
      allowNull: true,
      type: Sequelize.TEXT,
      defaultValue: 'No reason provided',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tickets', 'close_reason', {
      allowNull: true,
      type: Sequelize.TEXT,
      defaultValue: null,
    });
  }
};
