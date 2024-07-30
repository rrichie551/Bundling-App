/*
  Warnings:

  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Offer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Bundle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "offerDesc" TEXT,
    "selected" TEXT NOT NULL DEFAULT 'default',
    "selectedRule" TEXT NOT NULL DEFAULT 'default',
    "selectedDesk" INTEGER NOT NULL,
    "selectedMob" INTEGER NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'default',
    "channels" TEXT NOT NULL DEFAULT 'default',
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
    "type" TEXT NOT NULL,
    CONSTRAINT "Bundle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
