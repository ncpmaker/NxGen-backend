const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

//routes
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const caseScenariosRoute = require('./routes/caseScenariosRoute')
const caseScenarioHistoryRoute = require('./routes/caseScenarioHistoryRoute')
const testHistoryRoute = require('./routes/testHistoryRoute')
const enablePostTestRoute = require('./routes/enablePostTestRoute')
const adminRoute = require('./routes/adminRoute')

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
)
app.use(express.json())
app.use('/user', userRoute)
app.use('/auth', authRoute)
app.use('/case-scenarios', caseScenariosRoute)
app.use('/case-scenario-history', caseScenarioHistoryRoute)
app.use('/test-history', testHistoryRoute)
app.use('/enable-post-test', enablePostTestRoute)
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
