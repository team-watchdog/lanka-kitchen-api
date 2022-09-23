/*
  Warnings:

  - You are about to drop the column `logoURL` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `profileUrl` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "logoURL",
DROP COLUMN "profileUrl",
ADD COLUMN     "profileImageUrl" TEXT;
