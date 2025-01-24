package kh.study.emp.emp.controller;
@Controller
@RequestMapping("/emp")
public class EmpServicer {
	@Resource(name = "empService")
	private EmpService empService;
	
	@Resource(name = "deptService")
	private DeptService deptService;
	
	//첫 홈 화면
	@GetMapping("/home")
	public String home() {
		return "content/home";
	}
	
	//사원등록 메뉴버튼 클릭시 이동
	@GetMapping("/regEmp")
	public String regEmpForm(EmpVO empVO,DeptVO deptVO,Model model) {
		//부서목록조회
		model.addAttribute("deptList", deptService.selectDept());
		return "content/reg";
	}
	
	//사원등록 하러가기(form태그)
	//*** 연락처 tell input태그 3개를 어떻게 가져올 것인가?
	//우리가 넣어야할 방법은 010-3333-4444 이다
	//---- replace 함수 사용하기-------------------//
	@PostMapping("/regEmp")
	public String regEmp(EmpVO empVO) {
//		empVO.getTell(); // "010,1111,2222" 
//		String tell = empVO.getTell().replace(",", "-");
//		System.out.println(tell);//010,1111,2222 --> 010-1111-2222
//		empVO.setTell(tell);
		
		//요약하여 한줄로 만들기
		empVO.setTell(empVO.getTell().replace(",", "-"));
		
		empService.insertEmp(empVO);
		return "redirect:/emp/list";
	}
	
	//사원목록
	@GetMapping("/list")
	public String list(Model model) {
		model.addAttribute("empList", empService.selectEmp());
		return "content/list";
	}
	
}