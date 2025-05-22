package model;

public class Exam {
    private String time;
    private String number;
    private String subject;
    private String question;
    private String choice1;
    private String choice2;
    private String choice3;
    private String choice4;
    private String answer;

    public Exam(String time, String number, String subject, String question,
                String choice1, String choice2, String choice3, String choice4, String answer) {
        this.time = time;
        this.number = number;
        this.subject = subject;
        this.question = question;
        this.choice1 = choice1;
        this.choice2 = choice2;
        this.choice3 = choice3;
        this.choice4 = choice4;
        this.answer = answer;
    }

    public String getTime() { return time; }
    public String getNumber() { return number; }
    public String getSubject() { return subject; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public String getChoice1() { return choice1; }
    public String getChoice2() { return choice2; }
    public String getChoice3() { return choice3; }
    public String getChoice4() { return choice4; }
}