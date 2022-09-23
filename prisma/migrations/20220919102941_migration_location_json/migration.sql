/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "locations" JSONB;

-- DropTable
DROP TABLE "Location";
