(function() {
window.IgnoreList = {
	add(url) {
		return browser.storage.local.get('ignoreList').then((result) => {
			const ignoreList = result.ignoreList || [];
			const canonicalUrl = removeFragment(url);
			if (ignoreList.indexOf(url) !== -1) return;
			ignoreList.push(canonicalUrl);
			return browser.storage.local.set({ignoreList}).then(() => canonicalUrl);
		});
	},

	checkFor(url) {
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
	},
};

function removeFragment(urlString) {
	const url = new URL(urlString);
	url.hash = '';
	return url.toString();
}
})();
