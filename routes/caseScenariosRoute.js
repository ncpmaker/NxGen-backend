const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const { auth } = require("../middlewares");
const router = express.Router();
const prisma = new PrismaClient();

router.post("/", auth, async (req, res) => {
  await prisma.caseScenarios
    .create({
      data: req.body,
    })
    .then(() => {
      res.status(200).send("Successfully created a case scenario!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});

router.get("/", auth, async (req, res) => {
  await prisma.caseScenarios
    .findMany({
      where: {
        category: req.query.category,
      },
      select: {
        id: true,
      },
      orderBy: {
        created_at: "asc",
      },
    })
    .then((caseScenarios) => res.status(200).send(caseScenarios))
    .catch((err) => res.status(500).send("Internal server error"));
});

router.get("/:id", auth, async (req, res) => {
  await prisma.caseScenarios
    .findUnique({
      where: {
        id: req.params.id,
        category: req.query.category,
      },
    })
    .then((caseScenario) => res.status(200).send(caseScenario))
    .catch((err) => res.status(500).send("Internal server error"));
});

router.put("/:id", auth, async (req, res) => {
  await prisma.caseScenarios
    .update({
      where: {
        id: req.params.id,
        category: req.query.category,
      },
      data: req.body,
    })
    .then(() => {
      res.status(200).send("Case scenario updated.");
    })
    .catch((err) => res.status(500).send("Internal server error"));
});

router.delete(":id", auth, async (req, res) => {
  await prisma.caseScenarios
    .delete({
      where: {
        id: req.params.id,
        category: req.query.category,
      },
    })
    .then(() => {
      res.status(200).send("Case scenario deleted.");
    })
    .catch((err) => res.status(500).send("Internal server error"));
});

module.exports = router;
