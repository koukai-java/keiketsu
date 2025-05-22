package model;

public class Points {
	private String id;
	private String meridian;
	private String furigana;
	private String name;
	private String location;
	private String specific;
	private String learn;
	private String q_location;
	private String ans_location;
	private String q_specific;
	private String ans_specific;
	
	public Points(String id, String meridian, String furigana, String name, String location, String specific, String learn, String q_location, String ans_location, String q_specific, String ans_specific) {
		this.id = id;
		this.meridian = meridian;
		this.furigana = furigana;
		this.name = name;
		this.location = location;
		this.specific = specific;
		this.learn = learn;
		this.q_location = q_location;
		this.ans_location = ans_location;
		this.q_specific = q_specific;
		this.ans_specific = ans_specific;
	}
	public String getId() { return id;}
	public String getMeridian() { return meridian;}
	public String getFurigana() { return furigana;}
	public String getName() { return name; }
	public String getLocation() { return location; }
	public String getSpecific() { return specific; }
	public String getLearn() { return learn; }
	public String getQ_location() { return q_location; }
	public String getAns_location() { return ans_location; }
	public String getQ_specific() { return q_specific; }
	public String getAns_specific() { return ans_specific; }
}
