'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('tickets', 'message_id', {
      allowNull: false,
      unique: true,
      type: Sequelize.BIGINT,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('tickets', 'message_id')
  }
};
