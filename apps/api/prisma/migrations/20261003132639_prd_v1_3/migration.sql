-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "projectsDoneCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentsTaught" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teachingYears" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "descriptionId" DROP NOT NULL,
ALTER COLUMN "descriptionEn" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "showInStrip" BOOLEAN NOT NULL DEFAULT false;
