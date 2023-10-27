
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."Question" (
    "id" integer NOT NULL,
    "quizId" integer NOT NULL,
    "text" "text" NOT NULL,
    "options" "text"[],
    "correctAnswer" "text" NOT NULL
);

ALTER TABLE "public"."Question" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."Question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Question_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Question_id_seq" OWNED BY "public"."Question"."id";

CREATE TABLE IF NOT EXISTS "public"."Quiz" (
    "id" integer NOT NULL,
    "createdById" "text" NOT NULL,
    "topic" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."Quiz" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."QuizHistory" (
    "id" integer NOT NULL,
    "userId" "text" NOT NULL,
    "quizId" integer NOT NULL,
    "score" integer NOT NULL,
    "attemptedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE "public"."QuizHistory" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."QuizHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."QuizHistory_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."QuizHistory_id_seq" OWNED BY "public"."QuizHistory"."id";

CREATE SEQUENCE IF NOT EXISTS "public"."Quiz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."Quiz_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."Quiz_id_seq" OWNED BY "public"."Quiz"."id";

CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text",
    "oauth_id" "text"
);

ALTER TABLE "public"."User" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."Question" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Question_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."Quiz" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Quiz_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."QuizHistory" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."QuizHistory_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."QuizHistory"
    ADD CONSTRAINT "QuizHistory_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");

CREATE UNIQUE INDEX "User_oauth_id_key" ON "public"."User" USING "btree" ("oauth_id");

ALTER TABLE ONLY "public"."Question"
    ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."QuizHistory"
    ADD CONSTRAINT "QuizHistory_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."QuizHistory"
    ADD CONSTRAINT "QuizHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."Question" TO "anon";
GRANT ALL ON TABLE "public"."Question" TO "authenticated";
GRANT ALL ON TABLE "public"."Question" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Question_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Question_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Question_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."Quiz" TO "anon";
GRANT ALL ON TABLE "public"."Quiz" TO "authenticated";
GRANT ALL ON TABLE "public"."Quiz" TO "service_role";

GRANT ALL ON TABLE "public"."QuizHistory" TO "anon";
GRANT ALL ON TABLE "public"."QuizHistory" TO "authenticated";
GRANT ALL ON TABLE "public"."QuizHistory" TO "service_role";

GRANT ALL ON SEQUENCE "public"."QuizHistory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."QuizHistory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."QuizHistory_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Quiz_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Quiz_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Quiz_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";

GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
