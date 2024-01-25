const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10

const router = express.Router()
const prisma = new PrismaClient()

// create account
router.post('/create', async (req, res) => {
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
        res.status(200).json({
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
          console.log(err)
          res.status(500).send(err)
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
      if (user !== null) {
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
                  res.status(200).json({
                    userId: user.id,
                    email: user.email,
                    token: token,
                    finishedPreTest: user.finished_pre_test,
                    finishedPostTest: user.finished_post_test,
                    finishedIntro: user.finished_intro,
                    section: user.section
                  })
                })
                .catch(err => res.status(500).send(err))
            } else {
              res.status(401).json({
                message: 'Account not yet approved'
              })
            }
          } else {
            res.status(401).json({
              message: 'Wrong password!'
            })
          }
        })
      } else {
        res.status(400).json({
          message: "Account doesn't exist!"
        })
      }
    })
    .catch(err => res.status(500).send(err))
})

//delete token on logout
router.delete('/logout', async (req, res) => {
  await prisma.tokens
    .delete({
      where: {
        token: req.get('Authorization').split(' ')[1]
      }
    })
    .then(() => res.status(200).send('Token deleted'))
    .catch(err => res.status(400).send(err))
})

//get user details
router.get('/get-user/:id', async (req, res) => {
  await prisma.users
    .findUnique({
      where: {
        id: req.params.id
      }
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err))
})

//update user account
router.put('/update/:id', async (req, res) => {
  await prisma.users
    .findUnique({
      where: {
        id: req.params.id
      },
      select: {
        email: true,
        password: true
      }
    })
    .then(async user => {
      if (req.body.email === undefined) {
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
                .then(() => res.status(200).send('password updated'))
                .catch(err => res.status(500).send(err))
            })
          } else {
            res.status(401).send('wrong old password')
          }
        })
      } else {
        await prisma.users
          .update({
            where: {
              id: req.params.id
            },
            data: {
              email: req.body.email
            }
          })
          .then(updatedUser =>
            res.status(200).send({
              newEmail: updatedUser.email
            })
          )
          .catch(err => res.status(500).send(err))
      }
    })
    .catch(err => res.status(500).send(err))
})

//delete user account
router.delete('/delete/:id', async (req, res) => {
  await prisma.users
    .delete({
      where: {
        id: req.params.id
      }
    })
    .then(() => res.status(200).send('Account deleted'))
    .catch(err => res.status(500).send(err))
})

module.exports = router
