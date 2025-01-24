package kh.study.emp.emp.vo;

@Getter
@Setter
@ToString
public class EmpVO {
		
	private String	empNo;
	private String	empName;
	private String	job;
	private int	age;
	private String	gender;
	private String	tell;
	private String	deptNo;
	//association 이용
	private DeptVO	deptInfo;
}