(function() {
const VERSION = '0.1';

window.IgnoreList = class {
	constructor(list) {
		this._list = list;
	}

	getItems() {
		return this._list;
	}

	setItems(ignoreList) {
		this._list = ignoreList;
	}

	add(url) {
		const canonicalUrl = removeQueryAndFragment(url);
		if (this._list.indexOf(canonicalUrl) !== -1) return;
		this._list.push(canonicalUrl);
		return canonicalUrl;
	}

	addOrigin(url) {
		const origin = getOrigin(url);
		if (this._list.indexOf(origin) !== -1) return;
		this._list.push(origin);
		return origin;
	}

	checkFor(url) {
		for (let ignoredUrl of this._list) {
			if (url.startsWith(ignoredUrl)) return true;
		}
		return false;
	}
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

const DEFAULT_CONFIG = {
	version: VERSION,  // TODO: read the version from manifest.json when needed.
	ignoreList: [],
	reportSameOriginVulnerabilities: false,
};

window.OpenerDetectorConfig = class {
	static get() {
		return browser.storage.local.get().then((result) => {
			// Work around Firefox <52 bug https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get#Return_value
			const resultObj = Array.isArray(result) ? result[0] : result;
			if (!resultObj.version) {
				Object.assign(resultObj, DEFAULT_CONFIG);
				const config = new window.OpenerDetectorConfig(resultObj);
				config.save();
				return config;
			} else {
				return new window.OpenerDetectorConfig(resultObj);
			}
		});
	}

	constructor(storageObj) {
		this._storageObj = storageObj;
		this._ignoreList = null;
	}

	getIgnoreList() {
		if (!this._ignoreList) {
			this._ignoreList = new IgnoreList(this._storageObj.ignoreList);
		}
		return this._ignoreList;
	}

	getReportSameOriginVulnerabilities() {
		return this._storageObj.reportSameOriginVulnerabilities;
	}

	setReportSameOriginVulnerabilities(reportSameOriginVulnerabilities) {
		this._storageObj.reportSameOriginVulnerabilities = reportSameOriginVulnerabilities;
	}

	save() {
		if (this._ignoreList) {
			this._storageObj.ignoreList = this._ignoreList.getItems();
		}
		return browser.storage.local.set(this._storageObj);
		// TODO: handle storage errors
	}
};
})();
