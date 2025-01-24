package hr.action;

import java.sql.*;
import java.util.regex.Pattern;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import hr.beans.staff;
import hr.controller.CommandAction;
import hr.dao.staffDao;

public class AddAction implements CommandAction {

	@Override
	public String requestPro(HttpServletRequest request, HttpServletResponse response) throws Throwable {
		boolean result;
		
		request.setCharacterEncoding("utf-8");
		String name = request.getParameter("name");
		String position = request.getParameter("position");
		String tel = request.getParameter("tel");
		String email = request.getParameter("email");
		
		//유효성 체크 : null & 이메일 & 휴대폰 체크
		if(!isNull(name)){
			result = false;
		}else if(!isNull(position)){
			result = false;
		}else if(!isNull(tel)){
			result = false;
		}else if(!isTel(tel)){ //정규 표현식을 사용한 전화번호 형식 검사
			result = false;
		}else if(!isNull(email)){
			result = false;
		}else if(!isEmail(email)){ //정규 표현식을 사용한 이메일 형식 검사
			result = false;
		}else{ //유효성 검사를 통과한 경우
			staff Staff = new staff();// 직원 추가를 위한 데이터들을 담기위해 Staff 객체에 메모리를 할당
			Staff.setName(name);
			Staff.setPosition(position);
			Staff.setTel(tel);
			Staff.setEmail(email);   
			result = staffDao.getInstance().getStaffAdd(Staff);
		}

		request.setAttribute("result", result); // 직원 추가 결과값을 뷰에 포워드합니다.
		return "addStaffAjax.jsp";
	}
	
	
	/* 유효성 검사 관련 함수: isNull, isEmail, isTel
	 * html과 javascript에서 이루어지는 유효성 검사는 결국 클라이언트 측에서만 이루어지기 때문에
	 * 얼마든지 변조 혹은 무효화가 가능하다. 따라서 임시방편에 지나지 않다. 이에 따라 변조가 불가능한 JSP단에서 한번 더 유효성 검사를 실시하여 주겠다.
	 */
	
	/* 널 값인지에 대한 검사
	 * 각 값은 null 혹은 "" 이어선 안된다.
	 */
	private static boolean isNull(String str){
		if(str == "" || str == null) {
			return false;
		}
		return true;
	}
	
	/* 이메일 형식인지에 대한 검사
	 * "아이디@도메인"의 형식을 충족해야 한다.
	 */
	private static boolean isEmail(String str) {
	    return Pattern.matches("[0-9a-zA-Z]+(.[_a-z0-9-]+)*@(?:\\w+\\.)+\\w+$", str);
	}
	
	/* 전화번호인지에 대한 형식 검사
	 * 각 연결부는 "-"로 구분되어야 한다. 각 부분에 대한 자리수도 충족시켜야 한다. "-"는 허용하지 않는다.
	 */
	private static boolean isTel(String str) {
	    return Pattern.matches("^\\d{2,3}-\\d{3,4}-\\d{4}$", str);
	}
}