-- CreateTable
CREATE TABLE "InviteCode" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "used" INTEGER NOT NULL,
    "max" INTEGER NOT NULL
);
