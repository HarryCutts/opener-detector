(function() {

function checkIgnoreListFor(url) {
	return browser.storage.local.get('ignoreList').then((result) => {
		if (!result[0].ignoreList) return false;
		// Work around Firefox <52 bug https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get#Return_value
		const ignoreList = Array.isArray(result) ? result[0].ignoreList : result.ignoreList;
		for (let ignoredURL of ignoreList) {
			if (url.startsWith(ignoredURL)) return true;
		}
		return false;
	});
	// TODO: handle storage error
}

function getReportPageURL(sourceURL) {
	const fragmentObj = {
		sourceURL: sourceURL,
	};
	const fragmentJSON = JSON.stringify(fragmentObj);
	return browser.extension.getURL('vuln_report_page.html') + '#' + encodeURIComponent(fragmentJSON);
}

if (window.opener) {
	const currentOpenerLocation = window.opener.location.toString();
	checkIgnoreListFor(currentOpenerLocation).then((isOnIgnoreList) => {
		if (!isOnIgnoreList) {
			console.log("window.opener is SET. The opener is currently at " + currentOpenerLocation);
			window.opener.location = getReportPageURL(currentOpenerLocation);
		} else {
			console.log("window.opener is SET, but the vulnerable page is on the ignore list.");
		}
	});
} else {
	console.log("window.opener is NOT SET.");
}
})();
