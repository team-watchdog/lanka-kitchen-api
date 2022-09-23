-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('Ration', 'Equipment');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('Active', 'Completed');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('Kg', 'L', 'ML', 'Nos');

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL DEFAULT E'Ration',
    "placeId" TEXT,
    "unit" "Unit",
    "quantity" DOUBLE PRECISION NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT E'Active',
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
