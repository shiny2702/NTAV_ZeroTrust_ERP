<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page import="java.util.ArrayList"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html5>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>명우니닷컴 - 직원관리 툴</title>
<!-- BootStrap, JQuery load -->
<link rel="stylesheet"
	href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script
	src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-1"></div>
			<div class="col-sm-10">
				<!-- 페이지 타이틀 -->
				<div class="text-center">
					<h2>명우니닷컴 - 직원 관리 프로그램</h2>
				</div>
				<!-- 카테고리 별 검색 -->
				<div
					style="height: 80px; background-image: url('resource/logo.png'); background-repeat: no-repeat; background-size: 100px 80px;">
					<br> <br>
					<form class="form-inline"
						action="http://localhost:8080/staff_mng/listSearch.do"
						method="post">
						<div class="text-right">
							<div class="form-group">
								<select class="form-control" id="category" name="category">
									<option selected value="stafflist_index">직원번호</option>
									<option value="stafflist_position">직급</option>
									<option value="stafflist_name">이름</option>
									<option value="stafflist_tel">전화번호</option>
									<option value="stafflist_email">이메일</option>
								</select>&nbsp;
							</div>
							<div class="form-group">
								<input type="text" id="searchTxt" name="searchTxt"
									class="form-control" placeholder="Enter search">&nbsp;
							</div>
							<div class="form-group">
								<button type="submit" class="btn btn-default">
									<span class="glyphicon glyphicon-search"></span> 검색하기
								</button>
							</div>
						</div>
					</form>
				</div>
				<hr>
				<!-- 직원 추가 -->
				<div class="col-sm-3 text-left" style="padding: 0px">
					<button type="button" class="btn btn-default" data-toggle="modal"
						data-target="#staffAddModal">
						<span class="glyphicon glyphicon-plus"></span> 추가하기
					</button>
				</div>
				<div class="col-sm-5"></div>
				<!-- 다운로드(CSV,XLS,XLSX) -->
				<div class="col-sm-4 text-right" style="padding: 0px">
					<form class="form-inline"
						action="http://localhost:8080/staff_mng/fileDown.do" method="get">
						<div class="form-group">
							<select class="form-control" id="extension" name="extension">
								<option selected value="csv">CSV</option>
								<option value="xls">XLS</option>
							</select>&nbsp;
						</div>
						<div class="form-group">
							<button type="submit" class="btn btn-default">
								<span class="glyphicon glyphicon-download-alt"></span> 다운로드
							</button>
						</div>
					</form>
				</div>
				<br>
				<hr>
				<!-- 직원 리스트 -->
				<div id="staffList" style="height: 700px; overflow: auto">
					<table id="staffListContent" class="table table-striped">
						<tr>
							<th>직원번호</th>
							<th>직급</th>
							<th>이름</th>
							<th>전화번호</th>
							<th>이메일</th>
							<th class="text-center">수정</th>
							<th class="text-center">삭제</th>
						</tr>
						<c:forEach items="${StaffList}" var="Staff">
							<tr>
								<!-- jstl의 표현식은 스크립트릿과 속성이 같아서 어디에쓰나 우선됨 -->
								<td>${Staff.index}</td>
								<td>${Staff.position}</td>
								<td>${Staff.name}</td>
								<td>${Staff.tel}</td>
								<td>${Staff.email}</td>
								<td class="text-center">
									<button type="button" class="btn btn-default btn-sm"
										onClick="staffEditOpen('${Staff.index}','${Staff.position}','${Staff.name}','${Staff.tel}','${Staff.email}')">
										<span class="glyphicon glyphicon-edit"></span>
									</button>
								</td>
								<td class="text-center" id="${Staff.index}">
									<button type="button" class="btn btn-default btn-sm"
										onClick="staffDeleteOpen('${Staff.index}')">
										<span class="glyphicon glyphicon-remove"></span>
									</button>
								</td>
							</tr>
						</c:forEach>
					</table>
				</div>
			</div>
			<div class="col-sm-1"></div>
		</div>
	</div>

	<!-- 직원 추가 Modal-->
	<div id="staffAddModal" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">직원 추가하기</h4>
				</div>
				<div class="modal-body">
					<iframe name="add"
						src="http://localhost:8080/staff_mng/event/addStaff.jsp"
						width="100%" height="370px" style="border: 0 solid #FFFFFF;"></iframe>
				</div>
			</div>
		</div>
	</div>

	<!-- 직원 편집 Modal-->
	<div id="staffEditModal" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">직원 편집하기</h4>
				</div>
				<div class="modal-body">
					<iframe name="edit"
						src="http://localhost:8080/staff_mng/event/editStaff.jsp"
						width="100%" height="370px" style="border: 0 solid #FFFFFF;"></iframe>
				</div>
			</div>
		</div>
	</div>

	<!-- 직원 삭제 Modal-->
	<div id="staffDeleteModal" class="modal fade" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">직원 삭제하기</h4>
				</div>
				<div class="modal-body" style="height: 130px">
					<iframe name="del"
						src="http://localhost:8080/staff_mng/event/deleteStaff.jsp"
						width="100%" height="100px" style="border: 0 solid #FFFFFF;"></iframe>
				</div>
			</div>
		</div>
	</div>

	<script>
		/* 직원 추가, 편집, 삭제 관련 함수 */
		function staffAddModalClose() {
			$('#staffAddModal').modal('toggle');
			//추가된 직원에 따른 리로드
			location.href = 'http://localhost:8080/staff_mng/listAll.do';
		}

		function staffEditOpen(index, position, name, tel, email) {
			edit.editInit(index, position, name, tel, email);
			$('#staffEditModal').modal('toggle');
		}

		function staffEditModalClose() {
			$('#staffEditModal').modal('toggle');
			location.href = 'http://localhost:8080/staff_mng/listAll.do';
		}

		function staffDeleteOpen(index) {
			del.deleteInit(index);
			$('#staffDeleteModal').modal('toggle');
		}

		function staffDeleteModalClose() {
			$('#staffDeleteModal').modal('toggle');
			location.href = 'http://localhost:8080/staff_mng/listAll.do';
		}
	</script>
</body>
</html>