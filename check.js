(function() {

function log(message) {
	console.info("Opener Detector: " + message);
}

function getReportPageURL(targetURL, sourceURL = null) {
	const fragmentObj = {
		sourceURL: sourceURL,
		targetURL: targetURL,
	};
	const fragmentJSON = JSON.stringify(fragmentObj);
	return browser.extension.getURL('vuln_report_page.html') + '#' + encodeURIComponent(fragmentJSON);
}

function tryToGetOpenerLocation() {
	try {
		return window.opener.location.toString();
	} catch (ex) {
		// Permission denied, probably because the opener is in a different domain.
		return document.referrer;
	}
}

if (window.opener && window.opener !== window) {
	const currentOpenerLocation = tryToGetOpenerLocation();
	if (currentOpenerLocation) {
		IgnoreList.checkFor(currentOpenerLocation).then((isOnIgnoreList) => {
			if (!isOnIgnoreList) {
				log("window.opener is SET! Opening report page.");
				window.opener.location = getReportPageURL(location.toString(), currentOpenerLocation);
			} else {
				log("window.opener is SET, but the vulnerable page or domain is on the ignore list.");
			}
		});
	} else {
		log("window.opener is SET, but the ignore list couldn't be checked as the link was cross-origin with no referrer.");
		window.opener.location = getReportPageURL(location.toString());
	}
} else if (window.opener === window) {
	log("window.opener is set, but equal to window, and therefore harmless.");
} else {
	log("window.opener is not set.");
}
})();
