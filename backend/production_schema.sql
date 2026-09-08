--
-- PostgreSQL database dump
--

\restrict uRDIcRmYhDW8gFJDtMn7Jj9N7yxG6YSymS5IthbhXhvxd4yosG9O9sjQ2lDbvxX

-- Dumped from database version 18.6 (c5250a2)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: interviewsessionstatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interviewsessionstatus AS ENUM (
    'not_started',
    'ongoing',
    'completed',
    'evaluated',
    'evaluating',
    'evaluation_failed'
);


--
-- Name: interviewstatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.interviewstatus AS ENUM (
    'draft',
    'ready',
    'ongoing',
    'completed',
    'cancelled'
);


--
-- Name: membershiprole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.membershiprole AS ENUM (
    'admin',
    'candidate'
);


--
-- Name: messagerole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.messagerole AS ENUM (
    'ai',
    'candidate'
);


--
-- Name: userrole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.userrole AS ENUM (
    'admin',
    'candidate'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversation_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_messages (
    id integer NOT NULL,
    session_id integer NOT NULL,
    role public.messagerole NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: conversation_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversation_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conversation_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversation_messages_id_seq OWNED BY public.conversation_messages.id;


--
-- Name: interview_evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_evaluations (
    id integer NOT NULL,
    session_id integer NOT NULL,
    overall_score integer NOT NULL,
    overall_feedback text NOT NULL,
    strengths jsonb NOT NULL,
    improvements jsonb NOT NULL,
    evaluator_model text NOT NULL,
    evaluated_at timestamp with time zone DEFAULT now(),
    question_evaluations jsonb NOT NULL
);


--
-- Name: interview_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interview_evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interview_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interview_evaluations_id_seq OWNED BY public.interview_evaluations.id;


--
-- Name: interview_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_questions (
    id integer NOT NULL,
    interview_id integer,
    question_id integer,
    order_sequence integer NOT NULL
);


--
-- Name: interview_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interview_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interview_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interview_questions_id_seq OWNED BY public.interview_questions.id;


--
-- Name: interview_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interview_sessions (
    id integer NOT NULL,
    interview_id integer,
    candidate_id integer,
    current_interview_question_id integer,
    status public.interviewsessionstatus NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);


--
-- Name: interview_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interview_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interview_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interview_sessions_id_seq OWNED BY public.interview_sessions.id;


--
-- Name: interviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interviews (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    job_position character varying(100) NOT NULL,
    seniority_level character varying(50) NOT NULL,
    max_questions integer NOT NULL,
    status public.interviewstatus,
    created_by integer,
    created_at timestamp with time zone DEFAULT now(),
    organization_id integer
);


--
-- Name: interviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interviews_id_seq OWNED BY public.interviews.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitations (
    id integer NOT NULL,
    email character varying NOT NULL,
    organization_id integer NOT NULL,
    token character varying,
    status character varying,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    invited_by integer,
    role public.membershiprole NOT NULL
);


--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- Name: organization_join_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_join_links (
    id integer NOT NULL,
    organization_id integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    created_by_user_id integer NOT NULL,
    expires_at timestamp with time zone,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organization_join_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_join_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_join_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_join_links_id_seq OWNED BY public.organization_join_links.id;


--
-- Name: organization_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_memberships (
    id integer NOT NULL,
    user_id integer NOT NULL,
    organization_id integer NOT NULL,
    role public.membershiprole NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organization_memberships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_memberships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_memberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_memberships_id_seq OWNED BY public.organization_memberships.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    question_text text NOT NULL,
    category character varying(50) NOT NULL,
    is_ai_generated boolean,
    target_position character varying(100),
    target_level character varying(50)
);


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_onboarded boolean DEFAULT false NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: conversation_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_messages ALTER COLUMN id SET DEFAULT nextval('public.conversation_messages_id_seq'::regclass);


--
-- Name: interview_evaluations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_evaluations ALTER COLUMN id SET DEFAULT nextval('public.interview_evaluations_id_seq'::regclass);


--
-- Name: interview_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_questions ALTER COLUMN id SET DEFAULT nextval('public.interview_questions_id_seq'::regclass);


--
-- Name: interview_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions ALTER COLUMN id SET DEFAULT nextval('public.interview_sessions_id_seq'::regclass);


--
-- Name: interviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews ALTER COLUMN id SET DEFAULT nextval('public.interviews_id_seq'::regclass);


--
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- Name: organization_join_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_join_links ALTER COLUMN id SET DEFAULT nextval('public.organization_join_links_id_seq'::regclass);


--
-- Name: organization_memberships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_memberships ALTER COLUMN id SET DEFAULT nextval('public.organization_memberships_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: conversation_messages conversation_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_messages
    ADD CONSTRAINT conversation_messages_pkey PRIMARY KEY (id);


--
-- Name: interview_evaluations interview_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_evaluations
    ADD CONSTRAINT interview_evaluations_pkey PRIMARY KEY (id);


--
-- Name: interview_evaluations interview_evaluations_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_evaluations
    ADD CONSTRAINT interview_evaluations_session_id_key UNIQUE (session_id);


--
-- Name: interview_questions interview_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_pkey PRIMARY KEY (id);


--
-- Name: interview_sessions interview_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_pkey PRIMARY KEY (id);


--
-- Name: interviews interviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: organization_join_links organization_join_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_join_links
    ADD CONSTRAINT organization_join_links_pkey PRIMARY KEY (id);


--
-- Name: organization_memberships organization_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_memberships
    ADD CONSTRAINT organization_memberships_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: organization_memberships uq_user_org_membership; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_memberships
    ADD CONSTRAINT uq_user_org_membership UNIQUE (user_id, organization_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_interviews_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_interviews_id ON public.interviews USING btree (id);


--
-- Name: ix_interviews_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_interviews_organization_id ON public.interviews USING btree (organization_id);


--
-- Name: ix_invitations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_invitations_email ON public.invitations USING btree (email);


--
-- Name: ix_invitations_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_invitations_id ON public.invitations USING btree (id);


--
-- Name: ix_invitations_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_invitations_token ON public.invitations USING btree (token);


--
-- Name: ix_organization_join_links_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organization_join_links_id ON public.organization_join_links USING btree (id);


--
-- Name: ix_organization_join_links_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organization_join_links_organization_id ON public.organization_join_links USING btree (organization_id);


--
-- Name: ix_organization_join_links_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_organization_join_links_token_hash ON public.organization_join_links USING btree (token_hash);


--
-- Name: ix_organization_memberships_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organization_memberships_id ON public.organization_memberships USING btree (id);


--
-- Name: ix_organization_memberships_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organization_memberships_organization_id ON public.organization_memberships USING btree (organization_id);


--
-- Name: ix_organization_memberships_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organization_memberships_user_id ON public.organization_memberships USING btree (user_id);


--
-- Name: ix_organizations_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_organizations_id ON public.organizations USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: conversation_messages conversation_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_messages
    ADD CONSTRAINT conversation_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id) ON DELETE CASCADE;


--
-- Name: invitations fk_invitations_invited_by_users; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT fk_invitations_invited_by_users FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- Name: interview_evaluations interview_evaluations_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_evaluations
    ADD CONSTRAINT interview_evaluations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.interview_sessions(id) ON DELETE CASCADE;


--
-- Name: interview_questions interview_questions_interview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;


--
-- Name: interview_questions interview_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: interview_sessions interview_sessions_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: interview_sessions interview_sessions_current_interview_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_current_interview_question_id_fkey FOREIGN KEY (current_interview_question_id) REFERENCES public.interview_questions(id);


--
-- Name: interview_sessions interview_sessions_interview_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interview_sessions
    ADD CONSTRAINT interview_sessions_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: interviews interviews_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interviews
    ADD CONSTRAINT interviews_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: invitations invitations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: organization_join_links organization_join_links_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_join_links
    ADD CONSTRAINT organization_join_links_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organization_join_links organization_join_links_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_join_links
    ADD CONSTRAINT organization_join_links_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_memberships organization_memberships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_memberships
    ADD CONSTRAINT organization_memberships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_memberships organization_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_memberships
    ADD CONSTRAINT organization_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict uRDIcRmYhDW8gFJDtMn7Jj9N7yxG6YSymS5IthbhXhvxd4yosG9O9sjQ2lDbvxX

