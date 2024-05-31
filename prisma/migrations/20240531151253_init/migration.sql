/*
  Warnings:

  - You are about to drop the column `pinalty` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "pinalty",
ADD COLUMN     "penalty" BOOLEAN NOT NULL DEFAULT false;
