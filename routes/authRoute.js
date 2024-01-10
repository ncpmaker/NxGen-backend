const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/student', async (req, res) => {
  if (req.body.userId !== undefined || req.get('Authorization') !== undefined) {
    await prisma.tokens
      .findUnique({
        where: {
          user_id: req.body.userId,
          token: req.get('Authorization').split(' ')[1]
        }
      })
      .then((token) => {
        if (token) {
          res.status(200).send('Account is authenticated')
        } else {
          res.status(401).send('Account is unauthenticated')
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  } else {
    res.status(401).send('Account is unauthenticated')
  }
})

router.post('/admin', async (req, res) => {
  if (req.get('Authorization') !== undefined) {
    await prisma.adminTokens
      .findUnique({
        where: {
          token: req.get('Authorization').split(' ')[1]
        }
      })
      .then((adminToken) => {
        if (adminToken) {
          res.status(200).send('Account is authenticated')
        } else {
          res.status(401).send('Account is unauthenticated')
        }
      })
      .catch((err) => res.status(500).send(err))
  } else {
    res.status(401).send('Account is unauthenticated')
  }
})

module.exports = router
