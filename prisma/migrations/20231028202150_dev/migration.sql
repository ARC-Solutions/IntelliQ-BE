/*
  Warnings:

  - The primary key for the `question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `quizHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `oauth_id` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quizHistory" DROP CONSTRAINT "quizHistory_quizId_fkey";

-- DropIndex
DROP INDEX "user_oauth_id_key";

-- AlterTable
ALTER TABLE "question" DROP CONSTRAINT "question_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "quizId" SET DATA TYPE TEXT,
ADD CONSTRAINT "question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "question_id_seq";

-- AlterTable
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "quiz_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "quiz_id_seq";

-- AlterTable
ALTER TABLE "quizHistory" DROP CONSTRAINT "quizHistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "quizId" SET DATA TYPE TEXT,
ADD CONSTRAINT "quizHistory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "quizHistory_id_seq";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "oauth_id";

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizHistory" ADD CONSTRAINT "quizHistory_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
