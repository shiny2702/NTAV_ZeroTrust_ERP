package hr.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import hr.beans.staff;

public class staffDao extends CommonDao {
	public static staffDao getInstance() {
		staffDao _instance = new staffDao();
		return _instance;
	}
	
	/* 직원 리스트 조회(전체) */
	public ArrayList<staff> getStaffListAll() throws SQLException {
        ResultSet rs = null;
        String sql = "select * from stafflist order by stafflist_name asc";
        rs = openConnection().executeQuery(sql); // sql을 실행하기위해 연결을 열어 쿼리를 실행하고 rs에 반환
        ArrayList<staff> StaffList = new ArrayList<staff>();// staff형 배열객체를 선언
 
        while (rs.next()) { 
        	staff Staff = new staff();// 데이터들을 담기위해 staff객체에 메모리를 할당
			Staff.setIndex(rs.getString("stafflist_index"));
			Staff.setName(rs.getString("stafflist_name"));
			Staff.setPosition(rs.getString("stafflist_position"));
			Staff.setTel(rs.getString("stafflist_tel"));
			Staff.setEmail(rs.getString("stafflist_email"));     
            StaffList.add(Staff);// 셋팅된 빈을 리스트에 추가
        }
        closeConnection();
        return StaffList;
    }
	
	/* 직원 리스트 조회(검색) */
	public ArrayList<staff> getStaffListSearch(String category, String searchTxt) throws SQLException {
        ResultSet rs = null;
        
        String sql = "select * from stafflist where "+category+" like '%"+searchTxt+"%' order by stafflist_name asc";
        rs = openConnection().executeQuery(sql); // sql을 실행하기위해 연결을 열어 쿼리를 실행하고 rs에 반환
        ArrayList<staff> StaffList = new ArrayList<staff>();// staff형 배열객체를 선언
 
        while (rs.next()) { 
        	staff Staff = new staff();// 데이터들을 담기위해 staff객체에 메모리를 할당
			Staff.setIndex(rs.getString("stafflist_index"));
			Staff.setName(rs.getString("stafflist_name"));
			Staff.setPosition(rs.getString("stafflist_position"));
			Staff.setTel(rs.getString("stafflist_tel"));
			Staff.setEmail(rs.getString("stafflist_email"));     
            StaffList.add(Staff);// 셋팅된 빈을 리스트에 추가
        }
        closeConnection();
        return StaffList;
    }

	/* 직원 추가 */
	public boolean getStaffAdd(staff Staff) throws SQLException {
		ResultSet rs = null;
		String sql = "INSERT INTO STAFFLIST VALUES(LPAD(STAFFLIST_INDEX_SEQ.NEXTVAL,3,'0'),'"+Staff.getName()+"','"+Staff.getPosition()+"','"+Staff.getTel()+"','"+Staff.getEmail()+"')";
	    rs = openConnection().executeQuery(sql);
	    boolean result = rs.next();
	    closeConnection();
	    return result;
	}

	/* 직원 편집 */
	public boolean getStaffEdit(String index, staff Staff) throws SQLException {
		ResultSet rs = null;
		String sql = "UPDATE STAFFLIST SET STAFFLIST_NAME='"+Staff.getName()+"', STAFFLIST_POSITION='"+Staff.getPosition()+"', STAFFLIST_TEL='"+Staff.getTel()+"', STAFFLIST_EMAIL='"+Staff.getEmail()+"' WHERE STAFFLIST_INDEX='"+index+"'";
		rs = openConnection().executeQuery(sql);
		boolean result = rs.next();
	    closeConnection();
	    return result;
	}

	/* 직원 삭제 */
	public boolean getStaffDelete(String index) throws SQLException {
		ResultSet rs = null;
		String sql = "DELETE FROM STAFFLIST WHERE STAFFLIST_INDEX='"+index+"'";
		rs = openConnection().executeQuery(sql);
		boolean result = rs.next();
	    closeConnection();
	    return result;
	}
}