(function() {

function getReportPageURL(sourceURL, targetURL) {
	const fragmentObj = {
		sourceURL: sourceURL,
		targetURL: targetURL,
	};
	const fragmentJSON = JSON.stringify(fragmentObj);
	return browser.extension.getURL('vuln_report_page.html') + '#' + encodeURIComponent(fragmentJSON);
}

if (window.opener) {
	const currentOpenerLocation = window.opener.location.toString();
	IgnoreList.checkFor(currentOpenerLocation).then((isOnIgnoreList) => {
		if (!isOnIgnoreList) {
			console.log("window.opener is SET. The opener is currently at " + currentOpenerLocation);
			window.opener.location = getReportPageURL(currentOpenerLocation, location.toString());
		} else {
			console.log("window.opener is SET, but the vulnerable page is on the ignore list.");
		}
	});
} else {
	console.log("window.opener is NOT SET.");
}
})();
