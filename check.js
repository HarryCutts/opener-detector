(function() {
if (window.opener) {
	console.log("window.opener is SET.");
	window.opener.location = 'data:text/html;charset=UTF-8,<script>alert("window.opener vulnerability!");</script>';
} else {
	console.log("window.opener is NOT SET.");
}
})();
