-- CreateTable
CREATE TABLE "AdminTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "AdminTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminTokens_token_key" ON "AdminTokens"("token");
