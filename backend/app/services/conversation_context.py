from models.conversation_message import MessageRole


MAX_HISTORY_TURNS = 10


class ConversationContextService:

    @staticmethod
    def build(interview, messages):
        conversation_lines = []
        questions_asked = []
        candidate_answers = []

        # Prune conversation history for LLM context
        if len(messages) > MAX_HISTORY_TURNS:
            messages = (
                messages[:2]
                + messages[-(MAX_HISTORY_TURNS - 2):]
            )

        for message in messages:
            if message.role == MessageRole.ai:
                speaker = "Interviewer"
                questions_asked.append(message.content)
            else:
                speaker = "Candidate"
                candidate_answers.append(message.content)

            conversation_lines.append(
                f"{speaker}: {message.content}"
            )

        interview_questions = ""
        for index, iq in enumerate(interview.questions, start=1):
            interview_questions += (
                f"{index}. {iq.question.question_text}\n"
            )

        questions_asked_str = "\n".join(
            f"{i+1}. {q}" for i, q in enumerate(questions_asked)
        ) or "None yet"

        recent_answers = candidate_answers[-3:] if candidate_answers else []

        candidate_answers_str = "\n".join(
            f"- {a}" for a in recent_answers
        ) or "None yet"

        return {
            "conversation": "\n".join(conversation_lines),
            "questions_asked": questions_asked_str,
            "candidate_answers": candidate_answers_str,
            "interview_questions": interview_questions.strip(),
        }