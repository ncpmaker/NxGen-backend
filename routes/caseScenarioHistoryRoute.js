const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

function twoDecimals(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100
}

router.post('/create', async (req, res) => {
  await prisma.caseScenarioHistory
    .count({
      where: {
        user_id: req.body.userId,
        case_id: req.body.caseId
      }
    })
    .then(async (count) => {
      await prisma.caseScenarioHistory
        .create({
          data: {
            user_id: req.body.userId,
            case_id: req.body.caseId,
            ...(count > 0 ? { times_taken: count + 1 } : {}),
            answers: req.body.answers,
            assessment_score: twoDecimals(req.body.assessmentScore),
            nursing_diagnosis_score: twoDecimals(req.body.nursingDiagScore),
            planning_score: twoDecimals(req.body.planningScore),
            intervention_score: twoDecimals(req.body.interventionScore),
            evaluation_score: twoDecimals(req.body.evaluationScore),
            overall_score: twoDecimals(req.body.overallScore)
          }
        })
        .then((history) => {
          res.status(200).json({
            historyId: history.id
          })
        })
        .catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })
    })
    .catch((err) => res.status(500).send(err))
})

router.get('/:id/get', async (req, res) => {
  await prisma.caseScenarioHistory
    .findUnique({
      where: {
        id: req.params.id
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        case_scenarios: {
          select: {
            category: true,
            planning: true
          }
        }
      }
    })
    .then((data) => {
      res.status(200).json({
        name: data.user.name,
        caseId: data.case_id,
        answers: {
          ...data.answers,
          shortTermGoalsDesc: data.case_scenarios.planning.shortTermGoalsDesc,
          longTermGoalsDesc: data.case_scenarios.planning.longTermGoalsDesc
        },
        category: data.case_scenarios.category,
        dateTaken: data.date_taken,
        timesTaken: data.times_taken,
        score: {
          assessment: data.assessment_score,
          nursingDiagnosis: data.nursing_diagnosis_score,
          planning: data.planning_score,
          intervention: data.intervention_score,
          evaluation: data.evaluation_score,
          overall: data.overall_score
        }
      })
    })
    .catch((err) => res.status(500).send(err))
})

router.get('/:userId/get-all', async (req, res) => {
  await prisma.caseScenarioHistory
    .findMany({
      where: {
        user_id: req.params.userId
      },
      select: {
        id: true,
        date_taken: true,
        case_scenarios: {
          select: {
            category: true
          }
        }
      },
      orderBy: {
        date_taken: 'desc'
      }
    })
    .then((data) => {
      let histories = []
      data.forEach((item) => {
        histories.push({
          id: item.id,
          category: item.case_scenarios.category,
          dateTaken: item.date_taken
        })
      })

      res.status(200).send(histories)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
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
        case_scenarios: {
          category: {
            ...(req.body.category !== 'All'
              ? {
                  contains: req.body.category,
                  mode: 'insensitive'
                }
              : {})
          }
        }
      }
    ]
  }

  if (req.body.cursor !== null) {
    await prisma.caseScenarioHistory
      .findMany({
        where: searchFilter,
        select: {
          id: true,
          date_taken: true,
          times_taken: true,
          user: {
            select: {
              name: true,
              section: true
            }
          },
          case_scenarios: {
            select: {
              id: true,
              category: true
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
        let histories = []

        data.forEach((item) => {
          histories.push({
            id: item.id,
            caseId: item.case_scenarios.id,
            category: item.case_scenarios.category,
            dateTaken: item.date_taken,
            timesTaken: item.times_taken,
            name: item.user.name,
            section: item.user.section
          })
        })

        res.status(200).send(histories)
      })
  } else {
    await prisma.caseScenarioHistory
      .findMany({
        where: searchFilter,
        select: {
          id: true,
          date_taken: true,
          times_taken: true,
          user: {
            select: {
              name: true,
              section: true
            }
          },
          case_scenarios: {
            select: {
              id: true,
              category: true
            }
          }
        },
        orderBy: {
          date_taken: 'desc'
        },
        take: 50
      })
      .then((data) => {
        let histories = []

        data.forEach((item) => {
          histories.push({
            id: item.id,
            caseId: item.case_scenarios.id,
            category: item.case_scenarios.category,
            dateTaken: item.date_taken,
            timesTaken: item.times_taken,
            name: item.user.name,
            section: item.user.section
          })
        })

        res.status(200).send(histories)
      })
      .catch((err) => res.status(500).send(err))
  }
})

module.exports = router
