/*
  Warnings:

  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - Added the required column `district` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geo` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "geo" JSONB NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL;
