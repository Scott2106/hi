/*
  Warnings:

  - You are about to drop the column `two_FA_enabled_at` on the `um_authentication` table. All the data in the column will be lost.
  - You are about to alter the column `client_id` on the `um_oauth_key` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(128)`.
  - You are about to drop the column `created_at` on the `um_role` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `um_role` table. All the data in the column will be lost.
  - You are about to alter the column `role_name` on the `um_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(50)`.
  - You are about to drop the column `refresh_token` on the `um_session` table. All the data in the column will be lost.
  - You are about to alter the column `site_name` on the `um_site` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(50)`.
  - You are about to drop the column `created_at` on the `um_user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `um_user` table. All the data in the column will be lost.
  - You are about to drop the `um_user_site_role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider_name]` on the table `um_provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[site_name]` on the table `um_site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_description` to the `um_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_type` to the `um_role` table without a default value. This is not possible if the table is not empty.
  - Made the column `logout_at` on table `um_session` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status_id` to the `um_site` table without a default value. This is not possible if the table is not empty.
  - Made the column `site_api_key` on table `um_site` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "priority_status" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENEDED', 'PENDING', 'REJECTED');

-- DropForeignKey
ALTER TABLE "um_authentication" DROP CONSTRAINT "fk_provider_id";

-- DropForeignKey
ALTER TABLE "um_authentication" DROP CONSTRAINT "fk_site_id";

-- DropForeignKey
ALTER TABLE "um_authentication" DROP CONSTRAINT "fk_user_id";

-- DropForeignKey
ALTER TABLE "um_oauth_key" DROP CONSTRAINT "fk_provider_id";

-- DropForeignKey
ALTER TABLE "um_oauth_key" DROP CONSTRAINT "fk_site_id";

-- DropForeignKey
ALTER TABLE "um_request" DROP CONSTRAINT "fk_auth_id";

-- DropForeignKey
ALTER TABLE "um_request" DROP CONSTRAINT "fk_service_id";

-- DropForeignKey
ALTER TABLE "um_request" DROP CONSTRAINT "fk_site_id";

-- DropForeignKey
ALTER TABLE "um_request" DROP CONSTRAINT "um_request_user_id_fkey";

-- DropForeignKey
ALTER TABLE "um_session" DROP CONSTRAINT "um_session_site_id_fkey";

-- DropForeignKey
ALTER TABLE "um_session" DROP CONSTRAINT "um_session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "um_user_site_role" DROP CONSTRAINT "um_user_site_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "um_user_site_role" DROP CONSTRAINT "um_user_site_role_site_id_fkey";

-- DropForeignKey
ALTER TABLE "um_user_site_role" DROP CONSTRAINT "um_user_site_role_user_id_fkey";

-- DropIndex
DROP INDEX "um_session_refresh_token_key";

-- AlterTable
ALTER TABLE "um_authentication" DROP COLUMN "two_FA_enabled_at",
ADD COLUMN     "access_token" VARCHAR(550),
ADD COLUMN     "oauth_sub_id" DECIMAL,
ADD COLUMN     "refresh_token" VARCHAR(550),
ADD COLUMN     "two_fa_enabled_at" TIMESTAMP(6),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "um_oauth_key" ALTER COLUMN "client_id" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "um_provider" ALTER COLUMN "provider_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "um_role" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "role_description" TEXT NOT NULL,
ADD COLUMN     "role_type" VARCHAR(50) NOT NULL,
ALTER COLUMN "role_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "um_session" DROP COLUMN "refresh_token",
ALTER COLUMN "login_at" DROP DEFAULT,
ALTER COLUMN "logout_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "um_site" ADD COLUMN     "status_id" INTEGER NOT NULL,
ALTER COLUMN "site_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "site_api_key" SET NOT NULL;

-- AlterTable
ALTER TABLE "um_user" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status_id" INTEGER,
ADD COLUMN     "updated_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "um_user_site_role";

-- CreateTable
CREATE TABLE "um_album" (
    "album_id" SERIAL NOT NULL,
    "gallery_id" INTEGER,
    "status_id" INTEGER,
    "album_name" VARCHAR(50) NOT NULL,
    "album_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_album_pkey" PRIMARY KEY ("album_id")
);

-- CreateTable
CREATE TABLE "um_creation_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "site_id" INTEGER,
    "table_name" VARCHAR(50),
    "record_id" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_creation_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "um_deletion_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "site_id" INTEGER,
    "table_name" VARCHAR(50),
    "record_id" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_deletion_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "um_deletion_log_detail" (
    "field_modification_id" SERIAL NOT NULL,
    "log_id" INTEGER,
    "field_name" VARCHAR(50),
    "old_value" JSONB,

    CONSTRAINT "um_deletion_log_detail_pkey" PRIMARY KEY ("field_modification_id")
);

-- CreateTable
CREATE TABLE "um_feature" (
    "feature_id" SERIAL NOT NULL,
    "feature_name" VARCHAR(100),

    CONSTRAINT "um_feature_pkey" PRIMARY KEY ("feature_id")
);

-- CreateTable
CREATE TABLE "um_file_type" (
    "file_type_id" SERIAL NOT NULL,
    "file_type_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "um_file_type_pkey" PRIMARY KEY ("file_type_id")
);

-- CreateTable
CREATE TABLE "um_forgot_password" (
    "forgot_password_id" SERIAL NOT NULL,
    "forgot_password_code" VARCHAR(6),
    "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "um_forgot_password_pkey" PRIMARY KEY ("forgot_password_id")
);

-- CreateTable
CREATE TABLE "um_functionalities" (
    "func_id" SERIAL NOT NULL,
    "func_name" VARCHAR(100) NOT NULL,
    "endpoint_url" VARCHAR(255) NOT NULL,
    "pfunc_id" INTEGER,
    "func_description" TEXT,
    "method" VARCHAR(10) NOT NULL,

    CONSTRAINT "um_functionalities_pkey" PRIMARY KEY ("func_id")
);

-- CreateTable
CREATE TABLE "um_gallery" (
    "gallery_id" SERIAL NOT NULL,
    "gallery_name" VARCHAR(50) NOT NULL,
    "gallery_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- CreateTable
CREATE TABLE "um_group" (
    "group_id" SERIAL NOT NULL,
    "group_name" VARCHAR(64),
    "group_description" TEXT,

    CONSTRAINT "um_group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "um_image" (
    "image_id" SERIAL NOT NULL,
    "album_id" INTEGER,
    "file_type_id" INTEGER,
    "status_id" INTEGER,
    "provider_id" INTEGER,
    "image_name" VARCHAR(50) NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "image_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "height" INTEGER,
    "version" VARCHAR(50),
    "width" INTEGER,

    CONSTRAINT "um_image_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "um_image_tags" (
    "image_tag_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "um_image_tags_pkey" PRIMARY KEY ("image_tag_id","image_id","tag_id")
);

-- CreateTable
CREATE TABLE "um_invited_user" (
    "user_site_role_permission_id" SERIAL NOT NULL,
    "invited_key" VARCHAR(6),
    "status_id" INTEGER,
    "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_invited_user_pkey" PRIMARY KEY ("user_site_role_permission_id")
);

-- CreateTable
CREATE TABLE "um_modification_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "site_id" INTEGER,
    "table_name" VARCHAR(50),
    "record_id" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_modification_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "um_modification_log_detail" (
    "field_modification_id" SERIAL NOT NULL,
    "log_id" INTEGER,
    "field_name" VARCHAR(50),
    "old_value" JSONB,

    CONSTRAINT "um_modification_log_detail_pkey" PRIMARY KEY ("field_modification_id")
);

-- CreateTable
CREATE TABLE "um_notification_category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50),

    CONSTRAINT "um_notification_category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "um_notification_type" (
    "type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(50),

    CONSTRAINT "um_notification_type_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "um_notification_user_site" (
    "notification_id" SERIAL NOT NULL,
    "user_notification_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "um_notification_user_site_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "um_oauth_provider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" VARCHAR(8) NOT NULL,

    CONSTRAINT "um_oauth_provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "um_parent_functionalities" (
    "pfunc_id" SERIAL NOT NULL,
    "pfunc_name" VARCHAR(100),
    "feature_id" INTEGER,

    CONSTRAINT "um_parent_functionalities_pkey" PRIMARY KEY ("pfunc_id")
);

-- CreateTable
CREATE TABLE "um_payment_method" (
    "payment_method_id" SERIAL NOT NULL,
    "payment_method_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "um_payment_method_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "um_permission" (
    "permission_id" SERIAL NOT NULL,
    "read_access" BOOLEAN,
    "update_access" BOOLEAN,
    "create_access" BOOLEAN,
    "delete_access" BOOLEAN,

    CONSTRAINT "um_permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "um_provider_site" (
    "provider_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "provider_config" JSONB,

    CONSTRAINT "um_provider_site_pkey" PRIMARY KEY ("provider_id","site_id")
);

-- CreateTable
CREATE TABLE "um_report" (
    "report_id" SERIAL NOT NULL,
    "report_type" VARCHAR(20),
    "report_title" VARCHAR(100),
    "report_description" TEXT,
    "report_query" TEXT,
    "file_path" TEXT,
    "file_name" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "um_request_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "site_id" INTEGER,
    "request_method" VARCHAR(10),
    "api_requested" JSONB,
    "user_ip" VARCHAR(16),
    "user_os" VARCHAR(10),
    "request_success" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_request_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "um_reset_type" (
    "reset_type_id" SERIAL NOT NULL,
    "reset_method" VARCHAR(255),

    CONSTRAINT "um_reset_type_pkey" PRIMARY KEY ("reset_type_id")
);

-- CreateTable
CREATE TABLE "um_reset_user" (
    "reset_user_id" SERIAL NOT NULL,
    "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "reset_type_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "um_reset_user_pkey" PRIMARY KEY ("reset_user_id")
);

-- CreateTable
CREATE TABLE "um_role_permission" (
    "role_permission_id" SERIAL NOT NULL,
    "role_id" INTEGER,
    "permission_id" INTEGER,

    CONSTRAINT "um_role_permission_pkey" PRIMARY KEY ("role_permission_id")
);

-- CreateTable
CREATE TABLE "um_site_gallery_role_permission" (
    "site_id" INTEGER NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "role_permission_id" INTEGER,

    CONSTRAINT "um_site_gallery_role_permission_pkey" PRIMARY KEY ("site_id","gallery_id")
);

-- CreateTable
CREATE TABLE "um_site_payment" (
    "site_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,

    CONSTRAINT "um_site_payment_pkey" PRIMARY KEY ("site_id","payment_method_id")
);

-- CreateTable
CREATE TABLE "um_site_report" (
    "site_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_site_report_pkey" PRIMARY KEY ("site_id","report_id")
);

-- CreateTable
CREATE TABLE "um_site_setting" (
    "func_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "is_enabled" BOOLEAN,

    CONSTRAINT "um_site_setting_pkey" PRIMARY KEY ("func_id","site_id")
);

-- CreateTable
CREATE TABLE "um_site_user_group" (
    "site_user_group_id" SERIAL NOT NULL,
    "user_site_role_permission_id" INTEGER,
    "group_id" INTEGER,

    CONSTRAINT "um_site_user_group_pkey" PRIMARY KEY ("site_user_group_id")
);

-- CreateTable
CREATE TABLE "um_status" (
    "status_id" SERIAL NOT NULL,
    "status_type" VARCHAR(64),
    "status_description" TEXT,
    "updated_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255),

    CONSTRAINT "um_status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "um_tags" (
    "tag_id" SERIAL NOT NULL,
    "tag_name" VARCHAR NOT NULL,

    CONSTRAINT "um_tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "um_task" (
    "task_id" SERIAL NOT NULL,
    "table_name" VARCHAR(100),
    "task_by_user" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload_msg" JSONB,
    "pk_name" VARCHAR(80),
    "priority" "priority_status" NOT NULL DEFAULT 'Low',

    CONSTRAINT "um_task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "um_task_queue" (
    "task_queue_id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "record_id" INTEGER,
    "status_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "um_task_queue_pkey" PRIMARY KEY ("task_queue_id")
);

-- CreateTable
CREATE TABLE "um_user_album_role_permission" (
    "user_id" INTEGER NOT NULL,
    "album_id" INTEGER NOT NULL,
    "role_permission_id" INTEGER,
    "uploaded_timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_user_album_role_permission_pkey" PRIMARY KEY ("user_id","album_id")
);

-- CreateTable
CREATE TABLE "um_user_gallery_role_permission" (
    "user_id" INTEGER NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "role_permission_id" INTEGER,
    "uploaded_timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_user_gallery_role_permission_pkey" PRIMARY KEY ("user_id","gallery_id")
);

-- CreateTable
CREATE TABLE "um_user_image_role_permission" (
    "user_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "role_permission_id" INTEGER,
    "uploaded_timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_user_image_role_permission_pkey" PRIMARY KEY ("user_id","image_id")
);

-- CreateTable
CREATE TABLE "um_user_profile" (
    "profile_id" SERIAL NOT NULL,
    "profile_name" VARCHAR(64),
    "profile_pin" VARCHAR(6),
    "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "um_user_profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "um_user_profile_field" (
    "field_key_id" SERIAL NOT NULL,
    "field_name" VARCHAR(255),

    CONSTRAINT "um_user_profile_field_pkey" PRIMARY KEY ("field_key_id")
);

-- CreateTable
CREATE TABLE "um_user_profile_field_details" (
    "profile_id" SERIAL NOT NULL,
    "field_key_id" INTEGER NOT NULL,
    "field_value" VARCHAR(255),
    "created_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "field_site_id" INTEGER,

    CONSTRAINT "um_user_profile_field_details_pkey" PRIMARY KEY ("profile_id","field_key_id")
);

-- CreateTable
CREATE TABLE "um_user_profile_field_site" (
    "field_site_id" SERIAL NOT NULL,
    "field_key_id" INTEGER,
    "site_id" INTEGER,

    CONSTRAINT "um_user_profile_field_site_pkey" PRIMARY KEY ("field_site_id")
);

-- CreateTable
CREATE TABLE "um_user_site_role_permission" (
    "user_site_role_permission_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "site_id" INTEGER,
    "role_permission_id" INTEGER,

    CONSTRAINT "um_user_site_role_permission_pkey" PRIMARY KEY ("user_site_role_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "um_album_album_name_key" ON "um_album"("album_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_deletion_log_detail_log_id_key" ON "um_deletion_log_detail"("log_id");

-- CreateIndex
CREATE UNIQUE INDEX "um_file_type_file_type_name_key" ON "um_file_type"("file_type_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_modification_log_detail_log_id_key" ON "um_modification_log_detail"("log_id");

-- CreateIndex
CREATE UNIQUE INDEX "um_reset_type_reset_method_key" ON "um_reset_type"("reset_method");

-- CreateIndex
CREATE UNIQUE INDEX "role_id" ON "um_role_permission"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "um_tags_tag_name_key" ON "um_tags"("tag_name");

-- CreateIndex
CREATE INDEX "um_task_queue_statusid_idx" ON "um_task_queue"("status_id");

-- CreateIndex
CREATE UNIQUE INDEX "um_user_profile_profile_name_key" ON "um_user_profile"("profile_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_user_profile_field_field_name_key" ON "um_user_profile_field"("field_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_provider_provider_name_key" ON "um_provider"("provider_name");

-- CreateIndex
CREATE UNIQUE INDEX "um_site_site_name_key" ON "um_site"("site_name");

-- AddForeignKey
ALTER TABLE "um_album" ADD CONSTRAINT "fk_um_album_um_gallery" FOREIGN KEY ("gallery_id") REFERENCES "um_gallery"("gallery_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_album" ADD CONSTRAINT "fk_um_album_um_status" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "fk_provider_id" FOREIGN KEY ("provider_id") REFERENCES "um_oauth_provider"("provider_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "fk_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_creation_log" ADD CONSTRAINT "fk_creation_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_creation_log" ADD CONSTRAINT "fk_creation_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_deletion_log" ADD CONSTRAINT "fk_deletion_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_deletion_log" ADD CONSTRAINT "fk_deletion_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_deletion_log_detail" ADD CONSTRAINT "fk_deletion_log_detail_log_id" FOREIGN KEY ("log_id") REFERENCES "um_deletion_log"("log_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_forgot_password" ADD CONSTRAINT "fk_forgot_password_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_functionalities" ADD CONSTRAINT "um_functionalities_parent_fk" FOREIGN KEY ("pfunc_id") REFERENCES "um_parent_functionalities"("pfunc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image" ADD CONSTRAINT "fk_um_image_um_album" FOREIGN KEY ("album_id") REFERENCES "um_album"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image" ADD CONSTRAINT "fk_um_image_um_file_type" FOREIGN KEY ("file_type_id") REFERENCES "um_file_type"("file_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image" ADD CONSTRAINT "fk_um_image_um_provider" FOREIGN KEY ("provider_id") REFERENCES "um_provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image" ADD CONSTRAINT "fk_um_image_um_status" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image_tags" ADD CONSTRAINT "fk_um_image_tags_um_image" FOREIGN KEY ("image_id") REFERENCES "um_image"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_image_tags" ADD CONSTRAINT "fk_um_image_tags_um_tags" FOREIGN KEY ("tag_id") REFERENCES "um_tags"("tag_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_invited_user" ADD CONSTRAINT "fk_invited_user_status_id" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_modification_log" ADD CONSTRAINT "fk_modification_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_modification_log" ADD CONSTRAINT "fk_modification_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_modification_log_detail" ADD CONSTRAINT "fk_modification_log_detail_log_id" FOREIGN KEY ("log_id") REFERENCES "um_modification_log"("log_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_notification_user_site" ADD CONSTRAINT "um_notification_user_site_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "um_notification_category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_notification_user_site" ADD CONSTRAINT "um_notification_user_site_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "um_notification_type"("type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_notification_user_site" ADD CONSTRAINT "um_notification_user_site_user_notification_id_fkey" FOREIGN KEY ("user_notification_id") REFERENCES "um_user_site_role_permission"("user_site_role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_oauth_key" ADD CONSTRAINT "fk_provider_id" FOREIGN KEY ("provider_id") REFERENCES "um_oauth_provider"("provider_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_oauth_key" ADD CONSTRAINT "fk_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_parent_functionalities" ADD CONSTRAINT "um_parent_functionalities_feature_fk" FOREIGN KEY ("feature_id") REFERENCES "um_feature"("feature_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_provider_site" ADD CONSTRAINT "fk_um_provider_site_um_provider" FOREIGN KEY ("provider_id") REFERENCES "um_provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_provider_site" ADD CONSTRAINT "fk_um_provider_site_um_site" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "fk_auth_id" FOREIGN KEY ("auth_id") REFERENCES "um_authentication"("auth_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "fk_service_id" FOREIGN KEY ("service_id") REFERENCES "um_service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "fk_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request_log" ADD CONSTRAINT "fk_request_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_request_log" ADD CONSTRAINT "fk_request_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "um_reset_user" ADD CONSTRAINT "fk_reset_user_reset_id" FOREIGN KEY ("reset_type_id") REFERENCES "um_reset_type"("reset_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_reset_user" ADD CONSTRAINT "fk_reset_user_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_role_permission" ADD CONSTRAINT "fk_um_role_permission_um_permission" FOREIGN KEY ("permission_id") REFERENCES "um_permission"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_role_permission" ADD CONSTRAINT "fk_um_role_permission_um_role" FOREIGN KEY ("role_id") REFERENCES "um_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_session" ADD CONSTRAINT "fk_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_session" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site" ADD CONSTRAINT "um_site_status_fk" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_gallery_role_permission" ADD CONSTRAINT "fk_um_site_gallery_role_permission_um_gallery" FOREIGN KEY ("gallery_id") REFERENCES "um_gallery"("gallery_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_gallery_role_permission" ADD CONSTRAINT "fk_um_site_gallery_role_permission_um_site" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_gallery_role_permission" ADD CONSTRAINT "fk_um_site_gallery_role_um_role_permission" FOREIGN KEY ("role_permission_id") REFERENCES "um_role_permission"("role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_payment" ADD CONSTRAINT "um_site_payment_payment_method_fk" FOREIGN KEY ("payment_method_id") REFERENCES "um_payment_method"("payment_method_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_payment" ADD CONSTRAINT "um_site_payment_site_fk" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_report" ADD CONSTRAINT "um_site_report_report_fk" FOREIGN KEY ("report_id") REFERENCES "um_report"("report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_report" ADD CONSTRAINT "um_site_report_site_fk" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_setting" ADD CONSTRAINT "um_site_setting_func_fk" FOREIGN KEY ("func_id") REFERENCES "um_functionalities"("func_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_setting" ADD CONSTRAINT "um_site_setting_site_fk" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_user_group" ADD CONSTRAINT "fk_site_user_group_group_id" FOREIGN KEY ("group_id") REFERENCES "um_group"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_site_user_group" ADD CONSTRAINT "fk_site_user_group_permission_id" FOREIGN KEY ("user_site_role_permission_id") REFERENCES "um_user_site_role_permission"("user_site_role_permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_task" ADD CONSTRAINT "um_task_task_by_user_fkey" FOREIGN KEY ("task_by_user") REFERENCES "um_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_task_queue" ADD CONSTRAINT "um_task_queue_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_task_queue" ADD CONSTRAINT "um_task_queue_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "um_task"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_task_queue" ADD CONSTRAINT "um_task_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user" ADD CONSTRAINT "fk_user_status_id" FOREIGN KEY ("status_id") REFERENCES "um_status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_album_role_permission" ADD CONSTRAINT "fk_um_user_album_role_permission_um_album" FOREIGN KEY ("album_id") REFERENCES "um_album"("album_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_album_role_permission" ADD CONSTRAINT "fk_um_user_album_role_permission_um_role_permission" FOREIGN KEY ("role_permission_id") REFERENCES "um_role_permission"("role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_album_role_permission" ADD CONSTRAINT "fk_um_user_album_role_permission_um_user" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_gallery_role_permission" ADD CONSTRAINT "fk_um_user_gallery_role_permission_um_role_permission" FOREIGN KEY ("role_permission_id") REFERENCES "um_role_permission"("role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_gallery_role_permission" ADD CONSTRAINT "fk_um_user_gallery_role_permission_um_user" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_gallery_role_permission" ADD CONSTRAINT "fk_um_user_gallery_role_um_gallery" FOREIGN KEY ("gallery_id") REFERENCES "um_gallery"("gallery_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_image_role_permission" ADD CONSTRAINT "fk_um_user_image_role_permission_um_image" FOREIGN KEY ("image_id") REFERENCES "um_image"("image_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_image_role_permission" ADD CONSTRAINT "fk_um_user_image_role_permission_um_role_permission" FOREIGN KEY ("role_permission_id") REFERENCES "um_role_permission"("role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_image_role_permission" ADD CONSTRAINT "fk_um_user_image_role_permission_um_user" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_profile" ADD CONSTRAINT "fk_user_profile_user_id" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_profile_field_details" ADD CONSTRAINT "fk_user_profile_field_details_profile_id" FOREIGN KEY ("profile_id") REFERENCES "um_user_profile"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_profile_field_details" ADD CONSTRAINT "fk_user_profile_field_details_site_id" FOREIGN KEY ("field_site_id") REFERENCES "um_user_profile_field_site"("field_site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_profile_field_site" ADD CONSTRAINT "fk_user_profile_field_site_key_id" FOREIGN KEY ("field_key_id") REFERENCES "um_user_profile_field"("field_key_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_profile_field_site" ADD CONSTRAINT "fk_user_profile_field_site_site_id" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role_permission" ADD CONSTRAINT "fk_um_user_site_role_permission_um_user" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role_permission" ADD CONSTRAINT "fk_um_user_site_role_um_role_permission" FOREIGN KEY ("role_permission_id") REFERENCES "um_role_permission"("role_permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role_permission" ADD CONSTRAINT "fk_um_user_site_role_um_site" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;
