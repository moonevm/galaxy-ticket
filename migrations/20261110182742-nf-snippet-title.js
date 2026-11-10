'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('snippets', 'title', {
      allowNull: false,
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('snippets', 'title')
  }
};
