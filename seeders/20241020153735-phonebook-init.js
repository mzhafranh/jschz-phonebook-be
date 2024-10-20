'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Phonebooks', [
      {
        name: 'Aaron Doe',
        phone: '081235475636',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Abel Loe',
        phone: '081235477584',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bryan Joe',
        phone: '081235565636',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Caith Poe',
        phone: '082135478657',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deryl Noe',
        phone: '081229842313',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Eric Koe',
        phone: '081277663242',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fanny Yoe',
        phone: '081291981412',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gery Xoe',
        phone: '085767236871',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Henry Joe',
        phone: '08211119332',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Iris Roe',
        phone: '08194508171',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Phonebooks', null, {});
  }
};
