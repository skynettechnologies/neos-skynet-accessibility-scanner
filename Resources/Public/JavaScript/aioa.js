(function () {
	var cfg = window.AIOA_CONFIG || {};
	var licenseKey = cfg.licenseKey || '';
	var color      = cfg.color || '#420083';
	var position   = cfg.position || 'bottom_right';
	var iconType   = cfg.iconType || 'aioa-icon-type-1';
	var iconSize   = cfg.iconSize || 'aioa-medium-icon';

	// Prevent double load
	if (document.getElementById('aioa-adawidget')) return;
	var domain = window.location.hostname || '';
	if (!domain) return;
	var domainBase64 = btoa(domain);
	fetch('https://ada.skynettechnologies.us/api/add-user-domain', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: 'website=' + domainBase64
	})
		.then(function (res) {
			return res.json();
		})
		.then(function (apiResponse) {
			console.log('ADA API:', apiResponse);
			// 0 = EU | 1 = GLOBAL
			var noRequiredEU = apiResponse?.website_data?.no_required_eu ?? '1';
      console.log(noRequiredEU);
			var script = document.createElement('script');
			script.id = 'aioa-adawidget';
			if (noRequiredEU == '0') {
				// EU SCRIPT
				setTimeout(function () {
					script.src =
						'https://eu.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js' +
						'?colorcode=' + encodeURIComponent(color) +
						'&token=' + encodeURIComponent(licenseKey) +
						'&position=' + encodeURIComponent(position);
					script.defer = true;
					document.body.appendChild(script);
				}, 3000);
			} else {
				// GLOBAL SCRIPT
				script.src =
					'https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js' +
					'?colorcode=' + encodeURIComponent(color) +
					'&token=' + encodeURIComponent(licenseKey) +
					'&position=' + encodeURIComponent(position) +
					'.' + iconType +
					'.' + iconSize;

				script.async = true;
				document.head.appendChild(script);
			}
		})
		.catch(function (e) {
			console.error('[AIOA] API error:', e);
		});
})();
