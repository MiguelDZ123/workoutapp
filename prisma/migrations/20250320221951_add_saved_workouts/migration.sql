-- CreateTable
CREATE TABLE "SavedWorkout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWorkout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedWorkout" ADD CONSTRAINT "SavedWorkout_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
