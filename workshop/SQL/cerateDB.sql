-- Create table "tblUser"
CREATE TABLE "tblUser" (
    "fdUserID" SERIAL PRIMARY KEY,
    "fdPassword" TEXT,
    "fdFName" VARCHAR(50) NOT NULL,
    "fdLName" VARCHAR(25) NOT NULL,
	  "fdEMail" TEXT NOT NULL,
    "fdLastLogin" TIMESTAMP NOT NULL DEFAULT now(),
);

-- Create table "tblArticleGroup"
CREATE TABLE "tblArticleGroup" (
    "fdArticleGroupID" SERIAL PRIMARY KEY,
    "fdCaption" VARCHAR(25) NOT NULL
);

-- Create table "tblArticleType"
CREATE TABLE "tblArticleType" (
    "fdArticleTypeID" SERIAL PRIMARY KEY,
    "fdCaption" VARCHAR(25)
);

-- Create table "tblArticle"
CREATE TABLE "tblArticle" (
    "fdArticleGroupID" INTEGER NOT NULL,
    "fdArticleTypeID" INTEGER NOT NULL,
    "fdArticleID" INTEGER NOT NULL,
    PRIMARY KEY ("fdArticleGroupID", "fdArticleTypeID", "fdArticleID"),
    FOREIGN KEY ("fdArticleGroupID") REFERENCES "tblArticleGroup" ("fdArticleGroupID"),
    FOREIGN KEY ("fdArticleTypeID") REFERENCES "tblArticleType" ("fdArticleTypeID")
);

-- Create table "tblUserArticleList"
CREATE TABLE "tblUserArticleList" (
    "fdUserArticleListID" SERIAL PRIMARY KEY,
    "fdOwnerUserID" INTEGER NOT NULL,
    "fdCaption" VARCHAR(25),
	"fdShared" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("fdOwnerUserID") REFERENCES "tblUser" ("fdUserID")
);

-- Create table "tblUserArticleListMembership"
CREATE TABLE "tblUserArticleListMembership" (
    "fdUserArticleListID" INTEGER NOT NULL,
    "fdArticleGroupID" INTEGER NOT NULL,
    "fdArticleTypeID" INTEGER NOT NULL,
    "fdArticleID" INTEGER NOT NULL,
    PRIMARY KEY ("fdUserArticleListID", "fdArticleGroupID", "fdArticleTypeID", "fdArticleID"),
    FOREIGN KEY ("fdUserArticleListID") REFERENCES "tblUserArticleList" ("fdUserArticleListID"),
    FOREIGN KEY ("fdArticleGroupID", "fdArticleTypeID", "fdArticleID") REFERENCES "tblArticle" ("fdArticleGroupID", "fdArticleTypeID", "fdArticleID")
);