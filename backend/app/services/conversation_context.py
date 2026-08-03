from models.conversation_message import MessageRole


class ConversationContextService:

    @staticmethod
    def build(
        interview,
        messages,
    ):
        conversation = ""

        ai_messages = 0
        candidate_messages = 0

        for message in messages:

            if message.role == MessageRole.ai:
                speaker = "Interviewer"
                ai_messages += 1
            else:
                speaker = "Candidate"
                candidate_messages += 1

            conversation += (
                f"{speaker}: {message.content}\n"
            )

        interview_questions = ""

        for index, interview_question in enumerate(
            interview.questions,
            start=1,
        ):
            interview_questions += (
                f"{index}. "
                f"{interview_question.question.question_text}\n"
            )

        return {
            "conversation": conversation.strip(),
            "questions_asked": ai_messages,
            "candidate_answers": candidate_messages,
            "interview_questions": interview_questions.strip(),
        }