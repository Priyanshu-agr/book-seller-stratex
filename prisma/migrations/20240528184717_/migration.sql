/*
  Warnings:

  - You are about to drop the column `published_date` on the `Book` table. All the data in the column will be lost.
  - Added the required column `publishedDate` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "published_date",
ADD COLUMN     "publishedDate" DATE NOT NULL;
