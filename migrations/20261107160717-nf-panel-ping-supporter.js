'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('panels', 'ping_supporter', {
      defaultValue: true,
      allowNull: false,
      type: Sequelize.BOOLEAN,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('panels', 'ping_supporter')
  }
};
