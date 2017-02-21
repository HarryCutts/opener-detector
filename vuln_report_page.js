(function() {
/** An object containing the parameters passed to the report page in the URL fragment. */
const fragmentObj = JSON.parse(decodeURIComponent(location.hash.slice(1)));

const page = {
	report: document.getElementById('report'),
	sourcePageLink: document.getElementById('sourcePageLink'),
	targetPageLink: document.getElementById('targetPageLink'),
	ignoreButton: document.getElementById('ignoreButton'),
	ignoreDomainButton: document.getElementById('ignoreDomainButton'),
	returnButton: document.getElementById('returnButton'),
};

page.sourcePageLink.setAttribute('href', fragmentObj.sourceURL);
page.sourcePageLink.innerText = fragmentObj.sourceURL;

page.targetPageLink.setAttribute('href', fragmentObj.targetURL);
page.targetPageLink.innerText = fragmentObj.targetURL;

page.ignoreButton.addEventListener('click', (e) => {
	e.preventDefault();
	IgnoreList.add(fragmentObj.sourceURL).then(
			(url) => {
				alert(`Vulnerabilities on the page ${url} will no longer be reported.`);
			},
			(error) => {
				alert("An error occurred when adding the page to the ignore list. (See console for details.)");
				console.error(error);
			});
});

page.ignoreDomainButton.addEventListener('click', (e) => {
	e.preventDefault();
	IgnoreList.addOrigin(fragmentObj.sourceURL).then(
			(origin) => {
				alert(`Vulnerabilities on the origin ${origin} will no longer be reported.`);
			},
			(error) => {
				alert("An error occurred when adding the origin to the ignore list. (See console for details.)");
				console.error(error);
			});
});

page.returnButton.addEventListener('click', (e) => {
	e.preventDefault();
	history.back();
});

// Show the report element now that it's been filled out.
page.report.classList.add('ready');
})();
