-- CreateTable
CREATE TABLE "user_kit_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "planner_checks" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_kit_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_kit_progress_user_id_product_id_key" ON "user_kit_progress"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "user_kit_progress" ADD CONSTRAINT "user_kit_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_kit_progress" ADD CONSTRAINT "user_kit_progress_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
