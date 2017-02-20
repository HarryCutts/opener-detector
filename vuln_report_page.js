(function() {
/** An object containing the parameters passed to the report page in the URL fragment. */
const fragmentObj = JSON.parse(decodeURIComponent(location.hash.slice(1)));

const page = {
	report: document.getElementById('report'),
	sourcePageLink: document.getElementById('sourcePageLink'),
	ignoreButton: document.getElementById('ignoreButton'),
};

page.sourcePageLink.setAttribute('href', fragmentObj.sourceURL);
page.sourcePageLink.innerText = fragmentObj.sourceURL;

page.ignoreButton.addEventListener('click', (e) => {
	e.preventDefault();
	const urlWithoutFragment = removeFragment(fragmentObj.sourceURL);
	addToIgnoreList(urlWithoutFragment).then(
			() => {
				alert("Vulnerabilities on the page " + urlWithoutFragment + " will no longer be reported.");
			},
			(error) => {
				alert("There was a problem when adding " + urlWithoutFragment + " to the ignore list.");
				console.error(error);
			});
});

// Show the report element now that it's been filled out.
page.report.classList.add('ready');

function addToIgnoreList(url) {
	return browser.storage.local.get('ignoreList').then((result) => {
		const ignoreList = result.ignoreList || [];
		if (ignoreList.indexOf(url) !== -1) return;
		ignoreList.push(url);
		return browser.storage.local.set({ignoreList});
	});
}

function removeFragment(urlString) {
	const url = new URL(urlString);
	url.hash = '';
	return url.toString();
}
})();
