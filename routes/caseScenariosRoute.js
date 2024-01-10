const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/create', async (req, res) => {
  await prisma.caseScenarios
    .create({
      data: req.body
    })
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Successfully created a case scenario!!'
      })
    })
    .catch((err) => res.status(500).send(err))
})

router.get('/get-all/:category', async (req, res) => {
  await prisma.caseScenarios
    .findMany({
      where: {
        category: req.params.category
      },
      select: {
        id: true
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    .then((caseScenarios) => res.status(200).json(caseScenarios))
    .catch((err) => res.status(500).send(err))
})

router.get('/get/:category/:id', async (req, res) => {
  await prisma.caseScenarios
    .findUnique({
      where: {
        id: req.params.id
      }
    })
    .then((caseScenario) => res.status(200).json(caseScenario))
    .catch((err) => res.status(500).send(err))
})

router.put('/edit/:category/:id', async (req, res) => {
  await prisma.caseScenarios
    .update({
      where: {
        id: req.params.id,
        category: req.params.category
      },
      data: req.body
    })
    .then(() => {
      res.status(200).send('Case scenario updated.')
    })
    .catch((err) => res.status(500).send(err))
})

router.delete('/delete/:category/:id', async (req, res) => {
  await prisma.caseScenarios
    .delete({
      where: {
        id: req.params.id,
        category: req.params.category
      }
    })
    .then(() => {
      res.status(200).send('Case scenario deleted.')
    })
    .catch((err) => res.status(500).send(err))
})

module.exports = router
