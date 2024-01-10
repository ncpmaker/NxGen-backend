const express = require('express')
const { PrismaClient, Prisma, TestType } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/create', async (req, res) => {
  await prisma.users
    .update({
      where: {
        id: req.body.userId
      },
      data: {
        ...(req.body.testType === 'PRETEST'
          ? {
              finished_pre_test: true
            }
          : req.body.testType === 'POSTTEST'
          ? {
              finished_post_test: true
            }
          : {})
      }
    })
    .then(async () => {
      await prisma.testHistory.create({
        data: {
          user_id: req.body.userId,
          test_type: req.body.testType,
          answers: req.body.answers,
          score: req.body.score
        }
      })

      res.status(200).send('Test history created successfully')
    })
    .catch((err) => res.status(500).send(err))
})

router.post('/search', async (req, res) => {
  const searchFilter = {
    AND: [
      {
        user: {
          name: {
            contains: req.body.search,
            mode: 'insensitive'
          }
        }
      },
      {
        user: {
          section: {
            ...(req.body.section !== 'All'
              ? {
                  contains: req.body.section
                }
              : {})
          }
        }
      },
      {
        test_type: {
          ...(req.body.testType !== 'All'
            ? {
                in: [req.body.testType]
              }
            : {})
        }
      }
    ]
  }

  if (req.body.cursor !== null) {
    await prisma.testHistory
      .findMany({
        where: searchFilter,
        include: {
          user: {
            select: {
              name: true,
              section: true
            }
          }
        },
        orderBy: {
          date_taken: 'desc'
        },
        take: 50,
        skip: 1,
        cursor: {
          id: req.body.cursor
        }
      })
      .then((data) => {
        let history = []

        data.forEach((entry) => {
          history.push({
            id: entry.id,
            testType: entry.test_type,
            score: entry.score,
            dateTaken: entry.date_taken,
            answers: entry.answers,
            name: entry.user.name,
            section: entry.user.section
          })
        })

        res.status(200).send(history)
      })
      .catch((err) => res.status(500).send(err))
  } else {
    await prisma.testHistory
      .findMany({
        where: searchFilter,
        include: {
          user: {
            select: {
              name: true,
              section: true
            }
          }
        },
        orderBy: {
          date_taken: 'desc'
        },
        take: 50
      })
      .then((data) => {
        let history = []

        data.forEach((entry) => {
          history.push({
            id: entry.id,
            testType: entry.test_type,
            score: entry.score,
            dateTaken: entry.date_taken,
            answers: entry.answers,
            name: entry.user.name,
            section: entry.user.section
          })
        })

        res.status(200).send(history)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }
})
module.exports = router
