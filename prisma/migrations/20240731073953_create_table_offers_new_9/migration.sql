-- CreateTable
CREATE TABLE "Gift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "amount" TEXT,
    "offerDesc" TEXT,
    "selected" TEXT NOT NULL DEFAULT 'default',
    "selectedRule" TEXT NOT NULL DEFAULT 'default',
    "status" TEXT NOT NULL DEFAULT 'default',
    "channels" TEXT NOT NULL DEFAULT 'default',
    "resources" TEXT NOT NULL,
    "giftProducts" TEXT NOT NULL,
    "upsell" TEXT NOT NULL DEFAULT 'default',
    "behavior" TEXT NOT NULL DEFAULT 'default',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "percenDisc" TEXT,
    "fixDisc" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Gift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
