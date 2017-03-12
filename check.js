(function() {

function log(message) {
	console.info("Opener Detector: " + message);
}

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
			log("window.opener is SET! Opening report page.");
			window.opener.location = getReportPageURL(currentOpenerLocation, location.toString());
		} else {
			log("window.opener is SET, but the vulnerable page or domain is on the ignore list.");
		}
	});
} else {
	log("window.opener is not set.");
}
})();
