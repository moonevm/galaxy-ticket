'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('panels', 'welcome_title', {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('panels', 'welcome_title');
  }
};
