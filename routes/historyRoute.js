const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const { auth } = require('../middlewares')

const router = express.Router()
const prisma = new PrismaClient()

function twoDecimals(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100
}

router.post('/case-scenario/', auth, async (req, res) => {
  await prisma.caseScenarioHistory
    .count({
      where: {
        user_id: req.body.userId,
        case_id: req.body.caseId
      }
    })
    .then(async count => {
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
        .then(history => {
          res.status(200).json({
            historyId: history.id
          })
        })
        .catch(err => {
          res.status(500).send(err)
        })
    })
    .catch(err => res.status(500).send(err))
})

router.get('/case-scenario/search', auth, async (req, res) => {
  const searchFilter = {
    AND: [
      {
        OR: [
          {
            user: {
              name: {
                contains: req.query.search,
                mode: 'insensitive'
              }
            }
          },
          {
            case_scenarios: {
              id: {
                contains: req.query.search
              }
            }
          }
        ]
      },
      {
        user: {
          section: {
            ...(req.query.section !== 'All'
              ? {
                  contains: req.query.section
                }
              : {})
          }
        }
      },
      {
        case_scenarios: {
          category: {
            ...(req.query.category !== 'All'
              ? {
                  contains: req.query.category,
                  mode: 'insensitive'
                }
              : {})
          }
        }
      }
    ]
  }

  const select = {
    id: true,
    date_taken: true,
    times_taken: true,
    answers: true,
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
  }

  if (req.query.cursor !== undefined) {
    await prisma.caseScenarioHistory
      .findMany({
        where: searchFilter,
        select: select,
        orderBy: {
          date_taken: 'desc'
        },
        take: 50,
        skip: 1,
        cursor: {
          id: !req.query.cursor ? null : req.query.cursor
        }
      })
      .then(data => {
        let histories = []

        data.forEach(item => {
          histories.push({
            id: item.id,
            caseId: item.case_scenarios.id,
            category: item.case_scenarios.category,
            dateTaken: item.date_taken,
            timesTaken: item.times_taken,
            name: item.user.name,
            section: item.user.section,
            answers: item.answers
          })
        })

        res.status(200).send(histories)
      })
  } else {
    await prisma.caseScenarioHistory
      .findMany({
        where: searchFilter,
        select: select,
        orderBy: {
          date_taken: 'desc'
        },
        take: 50
      })
      .then(data => {
        let histories = []

        data.forEach(item => {
          console.log(item)
          histories.push({
            id: item.id,
            caseId: item.case_scenarios.id,
            category: item.case_scenarios.category,
            dateTaken: item.date_taken,
            timesTaken: item.times_taken,
            name: item.user.name,
            section: item.user.section,
            answers: item.answers
          })
        })

        res.status(200).send(histories)
      })
      .catch(err => res.status(500).send(err))
  }
})

router.get('/case-scenario/:id', auth, async (req, res) => {
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
    .then(data => {
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
    .catch(err => res.status(500).send(err))
})

router.get('/case-scenario/student/:userId', auth, async (req, res) => {
  await prisma.caseScenarioHistory
    .findMany({
      where: {
        user_id: req.params.userId
      },
      select: {
        id: true,
        case_id: true,
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
    .then(data => {
      let histories = []
      data.forEach(item => {
        histories.push({
          id: item.id,
          category: item.case_scenarios.category,
          caseId: item.case_id,
          dateTaken: item.date_taken
        })
      })

      res.status(200).send(histories)
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

router.post('/test/', async (req, res) => {
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
    .catch(err => res.status(500).send(err))
})

router.get('/test/search', auth, async (req, res) => {
  const searchFilter = {
    AND: [
      {
        user: {
          name: {
            contains: req.query.search,
            mode: 'insensitive'
          }
        }
      },
      {
        user: {
          section: {
            ...(req.query.section !== 'All'
              ? {
                  contains: req.query.section
                }
              : {})
          }
        }
      },
      {
        test_type: {
          ...(req.query.testType !== 'All'
            ? {
                in: [req.query.testType]
              }
            : {})
        }
      }
    ]
  }

  if (req.query.cursor !== undefined) {
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
          id: !req.query.cursor ? null : req.query.cursor
        }
      })
      .then(data => {
        let history = []

        data.forEach(entry => {
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
      .catch(err => res.status(500).send(err))
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
      .then(data => {
        let history = []

        data.forEach(entry => {
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
      .catch(err => {
        res.status(500).send(err)
      })
  }
})

router.get('/test/:userId', async (req, res) => {
  await prisma.testHistory
    .findMany({
      where: {
        user_id: req.params.userId
      },
      select: {
        test_type: true,
        score: true
      }
    })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})
module.exports = router
