(() => {
	'use strict';

	var $ = (e) => document.querySelector(e);

	$('#shorten-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const formData = new FormData(this);
		let shortenBtn = $('#shorten-btn'),
			shortenInp = $('#shorten-inp');

		shortenBtn.classList.add('loading');
		shortenBtn.disabled = true;
		shortenInp.disabled = true;
		fetch(SHORTENER_PATH, {
			method: 'POST',
			body: formData,
		})
			.then((resp) => resp.json())
			.then((resp) => {
				shortenBtn.classList.remove('loading');
				shortenBtn.disabled = false;
				shortenInp.disabled = false;
				shortenInp.value = window.location.origin + `/${resp.suffix}`;
			})
			.catch((e) => console.log(e));
	});

	$('#analytics-form').addEventListener('submit', function (e) {
		e.preventDefault();
		let url = new URL(new FormData(this).get('url'));

		let analyticsBtn = $('#analytics-btn'),
			analyticsResults = $('#analytics-results');

		analyticsBtn.classList.add('loading');
		analyticsBtn.disabled = true;
		fetch(`analytics${url.pathname}`, {
			method: 'POST',
		})
			.then((resp) => resp.json())
			.then((resp) => {
				analyticsBtn.classList.remove('loading');
				analyticsBtn.disabled = false;
				let resultTemplate = prepareAnalyticsTemplate(
					resp.url,
					new Date(resp.created).toLocaleString('en-us', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					}),
					resp.visits,
					resp.vd
				);
				analyticsResults.innerHTML = resultTemplate;
			});
	});
})();

const prepareAnalyticsTemplate = (orgURL, date, views, vd) => {
	let t = `
        <div class="flex">
            <div class="result-box">
                <span><img src="https://res.cloudinary.com/shaiqkar/image/upload/v1622639873/shrtst/link_ss8owl.svg"/>Original URL</span>
                <a href="${orgURL}" target="_blank"><p class="truncate" title="${orgURL}">${orgURL}</p></a>
            </div>
        </div>
        <div class="flex mt-3">
            <div class="result-box">
                <span><img src="https://res.cloudinary.com/shaiqkar/image/upload/v1622639873/shrtst/calendar_mtcgsd.svg"/>Created</span>
                <span>${date}</span>
            </div>
            <div class="result-box with-border">
                <span><img src="https://res.cloudinary.com/shaiqkar/image/upload/v1622639874/shrtst/eye_cvcmkp.svg" />Views</span>
                <span>${views}</span>
            </div>
            <div class="result-box">
                <span><img src="https://res.cloudinary.com/shaiqkar/image/upload/v1622639873/shrtst/ratio_h63awc.svg"/>VD Ratio</span>
                <span>${vd}</span>
            </div>
        </div>
    `;
	return t;
};
