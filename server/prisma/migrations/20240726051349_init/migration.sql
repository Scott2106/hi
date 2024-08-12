/*
  Warnings:

  - You are about to drop the column `access_token` on the `um_authentication` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `um_authentication` table. All the data in the column will be lost.
  - Added the required column `refresh_token` to the `um_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "um_authentication" DROP COLUMN "access_token",
DROP COLUMN "refresh_token";

-- AlterTable
ALTER TABLE "um_session" ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "um_site" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
