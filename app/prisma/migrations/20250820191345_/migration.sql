/*
  Warnings:

  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."User_cpf_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "cpf",
ALTER COLUMN "email" SET NOT NULL;
