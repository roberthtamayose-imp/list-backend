-- AlterTable
ALTER TABLE "shopping_items" ADD COLUMN     "registeredItemId" TEXT;

-- CreateTable
CREATE TABLE "registered_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultQuantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "defaultUnit" TEXT NOT NULL DEFAULT 'un',
    "category" TEXT NOT NULL DEFAULT 'outros',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "registered_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registered_items_userId_name_key" ON "registered_items"("userId", "name");

-- AddForeignKey
ALTER TABLE "shopping_items" ADD CONSTRAINT "shopping_items_registeredItemId_fkey" FOREIGN KEY ("registeredItemId") REFERENCES "registered_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_items" ADD CONSTRAINT "registered_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
