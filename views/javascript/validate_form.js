(function () {
	var usernameRegex = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

	var username = document.getElementsByClassName("form-control")[0];
	var pass1 = document.getElementsByClassName("form-control")[1];
	var pass2 = document.getElementsByClassName("form-control")[2];
	var userSpan = document.getElementsByClassName("username")[0];
	var passSpan = document.getElementsByClassName("password")[0];

	document.getElementsByTagName("form")[0].addEventListener("submit", function (e) {

		if (usernameRegex.test(username.value)) {
			e.preventDefault();
			userSpan.innerHTML = "\tUsername can only contain letters and digits.";
		}
		else if (pass1.value !== pass2.value) {
			e.preventDefault();
			passSpan.innerHTML = "Passwords dont match.";
		}
	});
})();