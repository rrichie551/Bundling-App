-- CreateTable
CREATE TABLE "Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "offerOn" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'default',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
