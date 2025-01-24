package kh.study.emp.dept.controller;

@Controller
@RequestMapping("/dept")
public class DeptController {
	@Resource(name = "deptService")
	private DeptService deptService;
	
	//부서관리페이지이동(부서등록 +  부서목록조회)
	@GetMapping("/manage")
//	<!-- 커맨드객체 주의할점!!! 컨트롤러에서 매개변수로 DeptVO 를 만약 dept라고 변수명을 적어도
//    커맨드객체사용을 하려면 무조건 deptVO처럼 객체명을 모두 소문자로 바꾼 채로만 사용가능하다!! -->
	public String deptManage(Model model,DeptVO deptVO) {
		//부서목록조회
		model.addAttribute("deptList",deptService.selectDept());
		return "content/manage";
	}
	
	//부서등록
	@PostMapping("/regDept")
	public String regDept(DeptVO deptVO) {
		deptService.insertDept(deptVO);
		return"redirect:/dept/manage";
	}
	
	//부서목록조회
	@GetMapping("/reg")
	public String deptList(Model model) {
		//부서목록조회
		model.addAttribute("deptList", deptService.selectDept());
		return "content/manage";

	}
}