-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "googleBooksId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "ratingsCount" INTEGER NOT NULL DEFAULT 0,
    "pageCount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "kindleUnlimited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_googleBooksId_key" ON "Book"("googleBooksId");
