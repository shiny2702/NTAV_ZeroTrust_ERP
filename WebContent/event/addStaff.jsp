<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<!-- BootStrap, JQuery load -->
<link rel="stylesheet"
	href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script
	src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

<!-- 직원 추가 양식 -->
<div class="container">
	<form class="form-horizontal">
		<div class="form-group">
			<label class="control-label col-sm-2" for="position">직급:</label>
			<div class="col-sm-10">
				<select class="form-control" id="position" name="position">
					<option selected value="사원">사원</option>
					<option value="대리">대리</option>
					<option value="과장">과장</option>
					<option value="차장">차장</option>
					<option value="부장">부장</option>
					<option value="임원">임원</option>
					<option value="대표">대표</option>
				</select>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2" for="name">이름:</label>
			<div class="col-sm-10">
				<input type="text" id="name" name="name" class="form-control"
					placeholder="Enter name">
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2" for="tel">전화번호:</label>
			<div class="col-sm-10">
				<input type="tel" id="tel" name="tel" class="form-control"
					placeholder="Enter xxx-xxxx-xxxx">
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-sm-2" for="email">이메일:</label>
			<div class="col-sm-10">
				<input type="email" id="email" name="email" class="form-control"
					placeholder="Enter xxx@xxx.xxx">
			</div>
		</div>
		<hr>
	</form>
		<div class="text-right">
			<div class="col-sm-offset-2 col-sm-10">
				<button onclick="formCheck()" class="btn btn-default">추가하기</button>
			</div>
		</div>
</div>


<script>
	/* 폼 입력 값 유효성 체크 */
	function formCheck() {
		// 입력 값 유효성 체크1: 값을 입력하였는지 → 아래 루프 코드 참고
		for (var i = 0; i < document.forms[0].length - 1; i++) { // submit 제외 모든 input 태그의 갯수만큼 루프를 돌면서
			if (document.forms[0][i].value == null
					|| document.forms[0][i].value == "") {
				alert(document.forms[0][i].name + "을/를 입력하여 주세요."); // 경고창을 띄우고
				document.forms[0][i].focus(); // null인 태그에 포커스를 줌
				return false;
			}
		}
		// 입력 값 유효성 체크2: 전화번호, 이메일주소 정규표현식 사용하여 유효성 검사 진행(RegExp 객체의 match 메소드 사용)
		var regTel = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
		var regEmail = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
		if (!$("#tel").val().match(regTel)) {
			alert("전화번호 형식을 확인하여 다시 입력해주세요.");
			$("#tel").focus();
		} else if (!$("#email").val().match(regEmail)) {
			alert("이메일 형식을 확인하여 다시 입력해주세요.");
			$("#email").focus();
		} else {
			// 유효성 체크에 이상이 없을 경우 ajax를 이용한 비동기통신 함수 호출
			formSubmit();
		}
	}

	/* 직원 추가 이벤트에 따른 비동기통신 실시 */
	function formSubmit() {
		var params = { // JSON 포맷으로 생성 
			name : $("#name").val(),
			position : $("#position").val(),
			tel : $("#tel").val(),
			email : $("#email").val()
		}
		$.ajax({
			url : 'http://localhost:8080/staff_mng/event/addStaffAjax.do',
			type : 'POST',
			data : params,
			success : ajaxSuccess,
			error : ajaxError
		});
	}

	/* 직원 추가 이벤트에 따른 비동기통신이 성공일 경우 */
	function ajaxSuccess(resdata) {
		if (resdata == "true") {
			// 데이타 성공일때 이벤트 작성
			alert("추가 되었습니다.");
			parent.staffAddModalClose();
		} else { //false일 경우
			alert("유효하지 않은 요청입니다. 확인 후 다시 요청하여주세요.");
		}
	}

	/* 직원 추가 이벤트에 따른 비동기통신이 실패일 경우 */
	function ajaxError() {
		alert("유효하지 않은 요청입니다. 확인 후 다시 요청하여주세요.");
	}
</script>