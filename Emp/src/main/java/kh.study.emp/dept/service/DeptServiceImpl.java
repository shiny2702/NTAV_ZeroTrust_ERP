package kh.study.emp.dept.service;

@Service("deptService")
public class DeptServiceImpl implements DeptService {
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	//목록조회
	@Override
	public List<DeptVO> selectDept() {
		return sqlSession.selectList("deptMapper.selectDept");
	}
	//부서등록
	@Override
	public void insertDept(DeptVO deptVO) {
		sqlSession.insert("deptMapper.insertDept",deptVO);
	}
}