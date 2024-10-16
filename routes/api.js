var express = require('express');
var router = express.Router();
const { Phonebook } = require('../models');
const { Op } = require('sequelize');

module.exports = function () {

    router.get('/phonebooks', async function (req, res, next) {
        try {
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const offset = (page - 1) * limit;
            var sort = req.body.sort ? req.body.sort : 'ASC';
            var keyword = req.body.keyword ? req.body.keyword : '';
            if (keyword != '') {
                const { count, rows } = await Phonebook.findAndCountAll({
                    where: {
                        [Op.or]: [{ name: { [Op.iLike]: `%${keyword}%` } }, { phone: { [Op.iLike]: `%${keyword}%` } }]
                    },
                    order: [['id', sort]],
                    offset: offset,
                    limit: limit,
                });
                const pages = Math.ceil(count / limit)
                res.status(200).json({
                    phonebooks: rows,
                    page,
                    limit,
                    pages,
                    total : count
                })
            } else {
                const { count, rows } = await Phonebook.findAndCountAll({order: [['id', sort]],offset,limit});
                const pages = Math.ceil(count / limit)
                res.status(200).json({
                    phonebooks: rows,
                    page,
                    limit,
                    pages,
                    total : count
                })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.post('/phonebooks', async function (req, res, next) {
        try {
            const { name, phone } = req.body
            const phonebook = await Phonebook.create({ name, phone })
            res.status(201).json(phonebook)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.put('/phonebooks/:id', async function (req, res, next) {
        try {
            const phonebook = await Phonebook.update(
                req.body,
                {
                    where: {
                        id: req.params.id,
                    },
                    returning: true,
                    plain: true
                },
            )
            res.status(201).json(phonebook[1])
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.delete('/phonebooks/:id', async function (req, res, next) {
        let id = req.params.id
        try {
            const phonebookFind = await Phonebook.findOne({ where: { id } })
            const phonebook = await Phonebook.destroy(
                {
                    where: {
                        id: req.params.id,
                    }
                }
            )
            res.status(200).json(phonebookFind)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.put('/phonebooks/:id/avatar', async function (req, res, next) {
        try {
            const phonebook = await Phonebook.update(
                req.body,
                {
                    where: {
                        id: req.params.id,
                    },
                    returning: true,
                    plain: true
                },
            )
            res.status(201).json(phonebook[1])
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    return router
}
