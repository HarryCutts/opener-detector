(function() {
if (window.opener) {
	console.log("window.opener is SET.");
	window.opener.location = browser.extension.getURL('vuln_report_page.html');
} else {
	console.log("window.opener is NOT SET.");
}
})();
