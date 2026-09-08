-- CreateTable
CREATE TABLE "business_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "businessName" VARCHAR(200) NOT NULL,
    "businessType" VARCHAR(50) NOT NULL,
    "customBusinessType" VARCHAR(100),
    "ownerName" VARCHAR(100),
    "phone" VARCHAR(20),
    "whatsapp" VARCHAR(20),
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "postalCode" VARCHAR(20),
    "logoUrl" VARCHAR(500),
    "isGstRegistered" BOOLEAN NOT NULL DEFAULT false,
    "gstin" VARCHAR(20),
    "taxNumber" VARCHAR(50),
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "currencySymbol" VARCHAR(5) NOT NULL DEFAULT '₹',
    "isMultiWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "isOnboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_userId_key" ON "business_profiles"("userId");

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
