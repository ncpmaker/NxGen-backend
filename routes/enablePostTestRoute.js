const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const { auth } = require('../middlewares')

const router = express.Router()
const prisma = new PrismaClient()

router.get('/', auth, async (req, res) => {
  await prisma.enablePostTest
    .findUnique({
      where: {
        id: 1
      }
    })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

//update enable post test
router.post('/', auth, async (req, res) => {
  await prisma.enablePostTest
    .update({
      where: {
        id: 1
      },
      data: req.body
    })
    .then(() => res.status(200).send('Post test enabled/disabled'))
    .catch(err => res.status(500).send(err))
})

module.exports = router
