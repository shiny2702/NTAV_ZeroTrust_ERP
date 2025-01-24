package kh.study.emp.emp.service;

@Service("empService")
public class EmpServiceImpl implements EmpService{
	@Autowired
	private SqlSessionTemplate sqlSession;
	@Override
	public void insertEmp(EmpVO empVO) {
		sqlSession.insert("empMapper.insertEmp", empVO);
	}
	@Override
	public List<EmpVO> selectEmp( ) {
		return sqlSession.selectList("empMapper.selectEmp");
	}
}