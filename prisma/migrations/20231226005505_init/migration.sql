-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseScenarios" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "assessment" TEXT[],
    "nursing_diagnosis" TEXT[],
    "planning" TEXT[],
    "inervention" TEXT[],

    CONSTRAINT "CaseScenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestHistory" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "answers" TEXT[],
    "times_taken" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TestHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "assessment" DOUBLE PRECISION NOT NULL,
    "nursing_diagnosis" DOUBLE PRECISION NOT NULL,
    "planning" DOUBLE PRECISION NOT NULL,
    "intervention" DOUBLE PRECISION NOT NULL,
    "evaluation" DOUBLE PRECISION NOT NULL,
    "overall" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_token_key" ON "Tokens"("token");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestHistory" ADD CONSTRAINT "TestHistory_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "CaseScenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
