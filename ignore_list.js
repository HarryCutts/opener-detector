(function() {
window.IgnoreList = {
	getItems() {
		return browser.storage.local.get('ignoreList').then((result) => {
			// Work around Firefox <52 bug https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get#Return_value
			const resultObj = Array.isArray(result) ? result[0] : result;
			if (!resultObj.ignoreList) return [];
			return resultObj.ignoreList;
		});
	},

	setItems(ignoreList) {
		return browser.storage.local.set({ignoreList});
	},

	add(url) {
		return browser.storage.local.get('ignoreList').then((result) => {
			const ignoreList = result.ignoreList || [];
			const canonicalUrl = removeQueryAndFragment(url);
			if (ignoreList.indexOf(url) !== -1) return;
			ignoreList.push(canonicalUrl);
			return this.setItems(ignoreList).then(() => canonicalUrl);
		});
	},

	addOrigin(url) {
		return browser.storage.local.get('ignoreList').then((result) => {
			const ignoreList = result.ignoreList || [];
			const origin = getOrigin(url);
			if (ignoreList.indexOf(origin) !== -1) return;
			ignoreList.push(origin);
			return this.setItems(ignoreList).then(() => origin);
		});
	},

	checkFor(url) {
		return this.getItems().then((ignoreList) => {
			for (let ignoredURL of ignoreList) {
				if (url.startsWith(ignoredURL)) return true;
			}
			return false;
		});
		// TODO: handle storage error
	},
};

function removeQueryAndFragment(urlString) {
	const url = new URL(urlString);
	url.hash = '';
	url.search = '';
	return url.toString();
}

function getOrigin(urlString) {
	const url = new URL(urlString);
	// Add a slash to the end to prevent bad matches (e.g. "https://foo.co" shouldn't match "https://foo.com")
	return url.origin.endsWith('/') ? url.origin : url.origin + '/';
}
})();
