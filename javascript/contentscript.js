var cache = {};

var lastTitle = "";

function getRatings(title) {
	if (cache[title]) {
		injectRatings(cache[title]);
	} else {
		fetchRatings(title, function(ratings) {
			cache[title] = ratings;
			injectRatings(ratings);
		});
	}
}

function getInfo() {
	var title = $(".jawBone > h3").text();
	if (title.length && (!lastTitle || !title.endsWith(lastTitle))) {
		lastTitle = title;
		// var year = $(".year").text().substring(0, 4);
		getRatings(title);
	}
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observerOptions = {
	childList: true,
	subtree: true
}

var titleObserver = new MutationObserver(function(mutations, observer) {
	getInfo();
});

var rowObserver = new MutationObserver(function(mutations, observer) {
	mutations.forEach(function(mutation) {
		if (mutation.addedNodes) {
			mutation.addedNodes.forEach(function(node) {
				node.nodeType === 1 && node.querySelectorAll(".jawBoneContent").forEach(function(node) {
					titleObserver.observe(node, observerOptions);
				})
			});
		}
	});
});

rowObserver.observe(document.querySelector(".mainView"), observerOptions);

document.querySelectorAll(".jawBoneContent").forEach(function(node) {
	titleObserver.observe(node, observerOptions);
});

function imdbRating(rating, id) {
	html = "";
	if (rating) {
		html += imdbSpan(id, "<img src=" + chrome.extension.getURL("images/imdb_31x14.png") + " />");
		html += imdbSpan(id, rating + "/10");
	}
	return html;
}

function imdbLink(id, html) {
	return "<a href=https://www.imdb.com/title/" + id + " target='_blank'>" + html + "</a>";
}

function imdbSpan(id, html) {
	return "<span class='imdbRating'>" + imdbLink(id, html) + "</span>";
}

function injectRatings(ratings) {
	rating = ratings["imdb"];
	id = ratings["imdbID"];
	$(".meta").append(imdbRating(rating, id));
}