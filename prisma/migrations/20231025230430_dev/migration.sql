/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_createdById_fkey";

-- DropForeignKey
ALTER TABLE "QuizHistory" DROP CONSTRAINT "QuizHistory_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "auth.users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "oauth_id" TEXT,

    CONSTRAINT "auth.users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth.users_email_key" ON "auth.users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth.users_oauth_id_key" ON "auth.users"("oauth_id");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth.users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizHistory" ADD CONSTRAINT "QuizHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth.users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
