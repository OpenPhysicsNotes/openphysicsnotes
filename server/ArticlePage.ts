
class RelatedArticle {
	title : string = "";

	href : string = "";
}

class ArticlePathElement {

	href : string = "";

	title : string = "";

	// TODO use
	children : ArticlePathElement[] = [];

	constructor(href : string = "", title : string = "") {
		this.href = href;
		this.title = title;
	}
}

class ArticlePage {

	title : string = "";

	article_content : string = "";

	related_articles : RelatedArticle[] = [];

	tags : string[] = [];

	article_path_elements : ArticlePathElement[] = [];

	to_html_page() : string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="/style.css">

	<title>${this.title}</title>

	<style>
		i-math {
			display: inline-block;
		}
		tex-math {
			display: block;
		}
	</style>
	<script async src="https://cdn.jsdelivr.net/npm/tex-math@latest/dist/tex-math.js"></script>
	<script async src="https://cdn.jsdelivr.net/npm/lc-ref@latest/dist/lc-ref.js"></script>

	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js"></script>
	<script>
		//hljs.highlightAll();
		document.addEventListener("DOMContentLoaded", function() {{
			document.querySelectorAll('code:not(.nohighlight)').forEach((block) => {{
				hljs.highlightElement(block);
			}});
		}})
	</script>
	
	<script src="/socket.io.min.js"></script>
	<script>
	var socket = io();
	socket.on('file-changed', function (msg) {
		console.log("file-changed:", msg);
		location.reload();
	});
	</script>
</head>
<body light-mode>

<header>
	<div>
		<div class="button"><a href="">OPN</a></div>
		<div class="links">
			<div class="button"><a href="">References</a></div>
			<div class="button"><a href="">Guides</a></div>
			<div class="button"><a href="">pages</a></div>
			<div class="button"><a href="">link</a></div>
		</div>
		<div class="button"><a href="">search</a></div>
	</div>
</header>

<lc-topnav>
	${this.article_path_to_html()}
</lc-topnav>

<lc-content>
	<lc-sidebar>
	${this.related_articles_to_html()}
	</lc-sidebar>
	<article>
		${this.article_content}

		<hr>
		<a href="./?raw">raw content</a>
	</article>
	<lc-nav-index></lc-nav-index>
</lc-content>

<script src="/index.js"></script>

</body>
</html>
`
	}

	related_articles_to_html() : string {
		if (this.related_articles.length == 0) {
			return "";
		}

		let html = `<div class="related-articles">
		<h2>Related articles</h2>
		<ul>`;

		for (let article of this.related_articles) {
			html += `<li><a href="${article.href}">${article.title}</a></li>`;
		}

		html += `</ul>
		</div>`;

		return html;
	}

	article_path_to_html() : string {
		if (this.article_path_elements.length == 0) {
			return "";
		}

		let html = `<div>`;

		for (let article_path_element of this.article_path_elements) {
			html += `<a href="${article_path_element.href}">${article_path_element.title}</a>`;
		}

		html += `</div>`;

		return html;
	}
}

export { ArticlePage, RelatedArticle, ArticlePathElement };