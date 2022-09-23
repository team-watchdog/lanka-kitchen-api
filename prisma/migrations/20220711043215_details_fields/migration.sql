-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "accountType" TEXT,
ADD COLUMN     "assistanceFrequency" TEXT,
ADD COLUMN     "assistanceTypes" TEXT[],
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "branchName" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "logoURL" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "peopleReached" TEXT,
ADD COLUMN     "phoneNumbers" TEXT[],
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "formattedAddress" TEXT NOT NULL,
    "placeId" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
