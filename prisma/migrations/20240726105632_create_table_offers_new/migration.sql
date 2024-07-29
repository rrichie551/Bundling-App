/*
  Warnings:

  - You are about to drop the column `offerOn` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `btnText` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channels` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `products` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selected` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedDesk` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedMob` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedRule` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variants` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widgetTitle` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "offerDesc" TEXT,
    "selected" TEXT NOT NULL,
    "selectedRule" TEXT NOT NULL,
    "selectedDesk" INTEGER NOT NULL,
    "selectedMob" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "channels" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "variants" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "percenDisc" TEXT,
    "fixDisc" TEXT,
    "widgetTitle" TEXT NOT NULL,
    "btnText" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'default',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("action", "createdAt", "endDate", "id", "priority", "startDate", "status", "title", "updatedAt", "userId") SELECT "action", "createdAt", "endDate", "id", "priority", "startDate", "status", "title", "updatedAt", "userId" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
