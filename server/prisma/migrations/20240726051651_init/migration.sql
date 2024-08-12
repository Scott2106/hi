/*
  Warnings:

  - You are about to drop the column `token_expiry_time` on the `um_site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "um_site" DROP COLUMN "token_expiry_time";
