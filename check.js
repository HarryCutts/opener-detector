(function() {

function getReportPageURL(sourceURL) {
	const fragmentObj = {
		sourceURL: sourceURL,
	};
	const fragmentJSON = JSON.stringify(fragmentObj);
	return browser.extension.getURL('vuln_report_page.html') + '#' + encodeURIComponent(fragmentJSON);
}

if (window.opener) {
	const currentOpenerLocation = window.opener.location.toString();
	console.log("window.opener is SET. The opener is currently at " + currentOpenerLocation);
	window.opener.location = getReportPageURL(currentOpenerLocation);
} else {
	console.log("window.opener is NOT SET.");
}
})();
