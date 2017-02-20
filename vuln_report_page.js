(function() {
/** An object containing the parameters passed to the report page in the URL fragment. */
const fragmentObj = JSON.parse(decodeURIComponent(location.hash.slice(1)));

const page = {
	report: document.getElementById('report'),
	sourcePageLink: document.getElementById('sourcePageLink'),
};

page.sourcePageLink.setAttribute('href', fragmentObj.sourceURL);
page.sourcePageLink.innerText = fragmentObj.sourceURL;

// Show the report element now that it's been filled out.
page.report.classList.add('ready');
})();
