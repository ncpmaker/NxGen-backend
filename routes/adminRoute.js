const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const { auth } = require('../middlewares')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/login', (req, res) => {
  if (req.body.username === process.env.ADMIN_USERNAME) {
    bcrypt.compare(req.body.password, process.env.ADMIN_PASSWORD).then(async result => {
      if (result) {
        const token = crypto.randomBytes(64).toString('hex')

        await prisma.adminTokens
          .create({
            data: {
              token: token
            }
          })
          .then(() => {
            res.status(200).json({
              adminToken: token
            })
          })
          .catch(err => res.status(500).send(err))
      } else {
        res.status(401).json({
          message: 'Wrong password'
        })
      }
    })
  } else {
    res.status(400).json({
      message: 'Wrong username or password'
    })
  }
})

//delete token on logout
router.delete('/logout', auth, async (req, res) => {
  await prisma.adminTokens
    .delete({
      where: {
        token: req.get('Authorization').split(' ')[1]
      }
    })
    .then(() => res.status(200).send('Token deleted'))
    .catch(err => res.status(400).send(err))
})

module.exports = router
