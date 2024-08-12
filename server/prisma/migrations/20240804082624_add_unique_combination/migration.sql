/*
  Warnings:

  - You are about to drop the column `access_token` on the `um_authentication` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `um_authentication` table. All the data in the column will be lost.
  - The primary key for the `um_image_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_tag_id` on the `um_image_tags` table. All the data in the column will be lost.
  - You are about to drop the column `auth_id` on the `um_request` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `um_request` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `um_status` table. All the data in the column will be lost.
  - You are about to drop the column `status_type` on the `um_status` table. All the data in the column will be lost.
  - You are about to drop the `um_forgot_password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `um_user_profile_field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `um_user_profile_field_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `um_user_profile_field_site` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,site_id]` on the table `um_authentication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[status_name]` on the table `um_status` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,site_id]` on the table `um_user_site_role_permission` will be added. If there are existing duplicate values, this will fail.
  - Made the column `pfunc_id` on table `um_functionalities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `func_description` on table `um_functionalities` required. This step will fail if there are existing NULL values in that column.
  - Added the required column ` refresh_token` to the `um_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_name` to the `um_status` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "um_forgot_password" DROP CONSTRAINT "fk_forgot_password_user_id";

-- DropForeignKey
ALTER TABLE "um_request" DROP CONSTRAINT "fk_auth_id";

-- DropForeignKey
ALTER TABLE "um_user_profile_field_details" DROP CONSTRAINT "fk_user_profile_field_details_profile_id";

-- DropForeignKey
ALTER TABLE "um_user_profile_field_details" DROP CONSTRAINT "fk_user_profile_field_details_site_id";

-- DropForeignKey
ALTER TABLE "um_user_profile_field_site" DROP CONSTRAINT "fk_user_profile_field_site_key_id";

-- DropForeignKey
ALTER TABLE "um_user_profile_field_site" DROP CONSTRAINT "fk_user_profile_field_site_site_id";

-- DropIndex
DROP INDEX "um_album_album_name_key";

-- AlterTable
ALTER TABLE "um_authentication" DROP COLUMN "access_token",
DROP COLUMN "refresh_token";

-- AlterTable
ALTER TABLE "um_functionalities" ADD COLUMN     "body" VARCHAR(255),
ALTER COLUMN "pfunc_id" SET NOT NULL,
ALTER COLUMN "func_description" SET NOT NULL;

-- AlterTable
ALTER TABLE "um_group" ADD COLUMN     "site_id" INTEGER;

-- AlterTable
ALTER TABLE "um_image_tags" DROP CONSTRAINT "um_image_tags_pkey",
DROP COLUMN "image_tag_id";

-- AlterTable
ALTER TABLE "um_request" DROP COLUMN "auth_id",
DROP COLUMN "code",
ADD COLUMN     "token" VARCHAR(550),
ALTER COLUMN "used" SET DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "um_session" ADD COLUMN     " refresh_token" VARCHAR(255) NOT NULL,
ALTER COLUMN "login_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "logout_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "um_status" DROP COLUMN "name",
DROP COLUMN "status_type",
ADD COLUMN     "status_name" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "um_forgot_password";

-- DropTable
DROP TABLE "um_user_profile_field";

-- DropTable
DROP TABLE "um_user_profile_field_details";

-- DropTable
DROP TABLE "um_user_profile_field_site";

-- CreateTable
CREATE TABLE "um_form_configuration" (
    "form_configuration_id" SERIAL NOT NULL,
    "form_field_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_form_configuration_pkey" PRIMARY KEY ("form_configuration_id")
);

-- CreateTable
CREATE TABLE "um_form_field" (
    "form_field_id" SERIAL NOT NULL,
    "field_type" VARCHAR(50) NOT NULL,
    "field_label" VARCHAR(255) NOT NULL,
    "field_order" INTEGER NOT NULL,

    CONSTRAINT "um_form_field_pkey" PRIMARY KEY ("form_field_id")
);

-- CreateTable
CREATE TABLE "um_submission_value" (
    "submission_value_id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "form_configuration_id" INTEGER,
    "field_value" TEXT,
    "created_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_submission_value_pkey" PRIMARY KEY ("submission_value_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_site" ON "um_authentication"("user_id", "site_id");

-- CreateIndex
CREATE UNIQUE INDEX "um_status_status_name_key" ON "um_status"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_user_site_role_permission_user_id_site_id_key" ON "um_user_site_role_permission"("user_id", "site_id");

-- AddForeignKey
ALTER TABLE "um_group" ADD CONSTRAINT "fk_um_group_site" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_form_configuration" ADD CONSTRAINT "fk_form_configuration_form_field" FOREIGN KEY ("form_field_id") REFERENCES "um_form_field"("form_field_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_form_configuration" ADD CONSTRAINT "fk_form_configuration_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_submission_value" ADD CONSTRAINT "fk_submission_value_form_configuration" FOREIGN KEY ("form_configuration_id") REFERENCES "um_form_configuration"("form_configuration_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_submission_value" ADD CONSTRAINT "fk_submission_value_user_profile" FOREIGN KEY ("profile_id") REFERENCES "um_user_profile"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;
