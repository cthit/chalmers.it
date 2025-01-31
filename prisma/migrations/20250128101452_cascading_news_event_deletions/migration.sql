-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_newsPostId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_newsPostId_fkey" FOREIGN KEY ("newsPostId") REFERENCES "NewsPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
