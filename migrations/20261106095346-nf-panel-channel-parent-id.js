'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('panels', 'channel_parent_id', Sequelize.BIGINT);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('panels', 'channel_parent_id');
  }
};
