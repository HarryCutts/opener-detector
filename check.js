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
		// (`window.opener` is still assignable, however, so the vulnerability still exists.)
		return document.referrer;
	}
}

function haveSameOrigin(a, b) {
	const urlA = new URL(a);
	const urlB = new URL(b);
	return urlA.origin === urlB.origin;
}

if (window.opener && window.opener !== window) {
	const currentOpenerLocation = tryToGetOpenerLocation();
	if (currentOpenerLocation) {
		OpenerDetectorConfig.get().then((config) => {
			const isOnIgnoreList = config.getIgnoreList().checkFor(currentOpenerLocation);
			const ignoreBecauseSameOrigin =
				!config.getReportSameOriginVulnerabilities()
				&& haveSameOrigin(location.toString(), currentOpenerLocation);
			if (!isOnIgnoreList && !ignoreBecauseSameOrigin) {
				log("window.opener is SET! Opening report page.");
				window.opener.location = getReportPageURL(location.toString(), currentOpenerLocation);
			} else {
				log("window.opener is SET, but ignoring the vulnerability due to your current settings.");
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
