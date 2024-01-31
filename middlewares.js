const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

exports.auth = async function (req, res, next) {
  if (req.headers.authorization && req.headers.role === 'student') {
    await prisma.tokens
      .findUnique({
        where: {
          token: req.headers.authorization.split(' ')[1]
        }
      })
      .then(token => {
        if (token) {
          next()
        } else {
          res.status(401).send('Account is unauthenticated')
        }
      })
      .catch(err => res.status(500).send('Internal server error'))
  } else if (req.headers.authorization && req.headers.role === 'admin') {
    await prisma.adminTokens
      .findUnique({
        where: {
          token: req.headers.authorization.split(' ')[1]
        }
      })
      .then(adminToken => {
        if (adminToken) {
          next()
        } else {
          res.status(401).send('Account is unauthenticated')
        }
      })
      .catch(err => res.status(500).send('Internal server error'))
  } else {
    res.status(401).send('Account is unauthenticated')
  }
}

// router.post('/admin', async (req, res) => {
//   if (req.headers.authorization !== undefined) {
//     await prisma.adminTokens
//       .findUnique({
//         where: {
//           token: req.headers.authorization.split(' ')[1]
//         }
//       })
//       .then((adminToken) => {
//         if (adminToken) {
//           res.status(200).send('Account is authenticated')
//         } else {
//           res.status(401).send('Account is unauthenticated')
//         }
//       })
//       .catch((err) => res.status(500).send(err))
//   } else {
//     res.status(401).send('Account is unauthenticated')
//   }
// })

// module.exports = router
