var express = require('express');
var router = express.Router();
var path = require('path');
const { Phonebook } = require('../models');
const { Op } = require('sequelize');

module.exports = function () {

    router.get('/phonebooks', async function (req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const offset = (page - 1) * limit;
            var sort = req.query.sort ? req.query.sort : 'ASC';
            var keyword = req.query.keyword ? req.query.keyword : '';
            if (keyword != '') {
                const { count, rows } = await Phonebook.findAndCountAll({
                    where: {
                        [Op.or]: [{ name: { [Op.iLike]: `%${keyword}%` } }, { phone: { [Op.iLike]: `%${keyword}%` } }]
                    },
                    order: [['name', sort]],
                    offset: offset,
                    limit: limit,
                });
                const pages = Math.ceil(count / limit)
                res.status(200).json({
                    phonebooks: rows,
                    page,
                    limit,
                    pages,
                    total: count
                })
            } else {
                const { count, rows } = await Phonebook.findAndCountAll({ order: [['name', sort]], offset, limit });
                const pages = Math.ceil(count / limit)
                res.status(200).json({
                    phonebooks: rows,
                    page,
                    limit,
                    pages,
                    total: count
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
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).send('No files were uploaded.');
            }
            let id = req.params.id
            const phonebookFind = await Phonebook.findOne({ where: { id } })
            var avatar = req.files.avatar
            var username = phonebookFind.dataValues.name
            var avatarFilename = username + Date.now() + path.extname(avatar.name)
            var filePath = path.join(__dirname, '..', 'public', 'uploads', avatarFilename)
            avatar.mv(filePath, async (err) => {
                if (err) {
                  return res.status(500).send(err);
                }
                const phonebook = await Phonebook.update(
                    {avatar: avatarFilename},
                    {
                        where: {
                            id: req.params.id,
                        },
                        returning: true,
                        plain: true
                    },
                )
                res.status(201).json(phonebook[1])
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    return router
}
