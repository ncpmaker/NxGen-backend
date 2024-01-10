const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10

const router = express.Router()
const prisma = new PrismaClient()

router.get('/get', async (req, res) => {
  await prisma.enablePostTest
    .findUnique({
      where: {
        id: 1
      }
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err))
})

//update enable post test
router.post('/', async (req, res) => {
  await prisma.enablePostTest
    .update({
      where: {
        id: 1
      },
      data: req.body
    })
    .then(() => res.status(200).send('Post test enabled/disabled'))
    .catch((err) => res.status(500).send(err))
})

module.exports = router
