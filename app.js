const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const port = 3000
const version = '/api/v2'

//routes
const userRoute = require('./routes/userRoute')
const caseScenariosRoute = require('./routes/caseScenariosRoute')
const historyRoute = require('./routes/historyRoute')
const enablePostTestRoute = require('./routes/enablePostTestRoute')
const adminRoute = require('./routes/adminRoute')

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
)
app.use(express.json())
app.use(`${version}/user`, userRoute)
app.use(`${version}/case-scenarios`, caseScenariosRoute)
app.use(`${version}/history`, historyRoute)
app.use(`${version}/enable-post-test`, enablePostTestRoute)
app.use(`${version}/admin`, adminRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
