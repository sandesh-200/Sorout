from models.conversation_message import MessageRole

class EvaluationContextService:

    @staticmethod
    def build(interview, messages):
        conversation = ""
        for message in messages:
            speaker = (
                "Candidate"
                if message.role == MessageRole.candidate
                else "Interviewer"
            )
            conversation += f"{speaker}: {message.content}\n"

        interview_questions = ""
        for index, iq in enumerate(interview.questions, start=1):
            interview_questions += f"{index}. {iq.question.question_text}\n"

        return {
            "position": interview.job_position,
            "level": interview.seniority_level,
            "conversation": conversation.strip(),
            "interview_questions": interview_questions.strip(),
        }
