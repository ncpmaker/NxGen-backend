const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { auth } = require('../middlewares')
const saltRounds = 10

const router = express.Router()
const prisma = new PrismaClient()

// create account
router.post('/signup', async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds).then(async hash => {
    await prisma.users
      .create({
        data: {
          email: req.body.email,
          password: hash,
          name: req.body.name,
          section: req.body.section
        }
      })
      .then(() => {
        res.status(200).send({
          success: true,
          message: 'Successfully created an account!'
        })
      })
      .catch(err => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            res.status(409).send(err)
          }
        } else {
          res.status(500).send('Internal server error')
        }
      })
  })
})

//log account
router.post('/login', async (req, res) => {
  await prisma.users
    .findUnique({
      where: {
        email: req.body.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        approved: true,
        finished_pre_test: true,
        finished_post_test: true,
        finished_intro: true,
        section: true
      }
    })
    .then(async user => {
      if (user) {
        // if user exists
        bcrypt.compare(req.body.password, user.password).then(async result => {
          if (result) {
            if (user.approved) {
              const token = crypto.randomBytes(64).toString('hex')

              await prisma.tokens
                .create({
                  data: {
                    user_id: user.id,
                    token: token
                  }
                })
                .then(() => {
                  res.status(200).send({
                    userId: user.id,
                    token: token,
                    name: user.name,
                    finishedPreTest: user.finished_pre_test,
                    finishedPostTest: user.finished_post_test,
                    finishedIntro: user.finished_intro,
                    section: user.section
                  })
                })
                .catch(err => res.status(500).send('Internal server error'))
            } else {
              res.status(401).send('Account not yet approved')
            }
          } else {
            res.status(401).send('Wrong password!')
          }
        })
      } else {
        res.status(400).send("Account doesn't exist!")
      }
    })
    .catch(err => res.status(500).send('Internal server error'))
})

//update user account
router.put('/:id', auth, async (req, res) => {
  await prisma.users
    .findUnique({
      where: {
        id: req.params.id
      },
      select: {
        password: true
      }
    })
    .then(async user => {
      if (req.body.finished_intro) {
        await prisma.users
          .update({
            where: {
              id: req.params.id
            },
            data: req.body
          })
          .then(() => res.status(200).send('Successfully updated'))
          .catch(err => res.status(500).send('Internal server error'))
      } else {
        bcrypt.compare(req.body.oldPassword, user.password).then(async result => {
          if (result) {
            bcrypt.hash(req.body.newPassword, saltRounds).then(async hash => {
              await prisma.users
                .update({
                  where: {
                    id: req.params.id
                  },
                  data: {
                    password: hash
                  }
                })
                .then(async () => {
                  await prisma.tokens
                    .deleteMany({
                      where: {
                        user_id: req.params.id
                      }
                    })
                    .then(() => res.status(200).send('password updated'))
                    .catch(err => res.status(500).send('Internal server error'))
                })
                .catch(err => res.status(500).send('Internal server error'))
            })
          } else {
            res.status(401).send('wrong old password')
          }
        })
      }
    })
    .catch(err => res.status(500).send('Internal server error'))
})

//delete token on logout
router.delete('/logout', auth, async (req, res) => {
  await prisma.tokens
    .delete({
      where: {
        token: req.headers.authorization.split(' ')[1]
      }
    })
    .then(() => res.status(200).send('Token deleted'))
    .catch(err => res.status(500).send('Internal server error'))
})

//delete user account
router.delete('/:id', auth, async (req, res) => {
  await prisma.users
    .delete({
      where: {
        id: req.params.id
      }
    })
    .then(() => res.status(200).send('Account deleted'))
    .catch(err => res.status(500).send('Internal server error'))
})

//get user details
// router.get('/get-user/:id', async (req, res) => {
//   await prisma.users
//     .findUnique({
//       where: {
//         id: req.params.id
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         section: true,
//         finished_intro: true,
//         finished_pre_test: true,
//         finished_post_test: true
//       }
//     })
//     .then(user => res.status(200).send(user))
//     .catch(err => res.status(500).send('Internal server error'))
// })

module.exports = router
