
import { BasicHtml5Page } from './basic_html'
import Markdown2Html from '../markdown'
import logger from '../logger';
import { watcher_enabled } from '../files_watcher';

var mdTransformer = new Markdown2Html();

export class ArticleHeader {

	public links : { name : string, href : string }[] = [
		{ name: 'Study Plans', href: '/study_plans' },
		{ name: 'About', href: '/about' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Docs', href: '/docs' },
	];

	private link_button(innerHtml : string, href : string) {
		return `<div class="button"><a href="${href}">${innerHtml}</a></div>`;
	}

	get html() : string {

		return `<header>
	<div>
		<!--div class="button"><a href="">OPN</a></div-->
		<a href="/"><img class="button logo" src="/favicon.ico?deg=182" alt="OPN"></img></a>
		<div class="links">
			${this.links.map(link => this.link_button(link.name, link.href)).join('')}
		</div>
		<!--div class="button"><a href="">search</a></div-->
		<div class="search-form"><div class="gcse-search" data-gname="storesearch"></div></div>
	</div>
</header>`;
	}
}

interface RelatedArticle {
	url : string;
	title : string;
	slug? : string;
}

export class ArticlePage extends BasicHtml5Page {

	public header = new ArticleHeader();

	public url : string = "";
	public fileUrl : string = "";
	public local : boolean = false;

	public article_html_content : string = "";

	public related_articles : RelatedArticle[] = [];

	get article_html() : string {
		return this.article_html_content;
	}

	constructor() {
		super();

		this._configure_styleSheets();
		this._configure_scripts();
	}

	useYamlMeta(yaml : any) {

		if (yaml.title && typeof yaml.title === "string") {
			this.title = yaml.title;
			this.meta["og:title"] = yaml.title;
			this.meta["twitter:title"] = yaml.title;
		}
		
		if (yaml.related_articles && Array.isArray(yaml.related_articles)) {
			for (let related_article of yaml.related_articles) {
				let article : RelatedArticle = { title:"", url:"" };

				if (related_article.title && typeof related_article.title === "string") {
					article.title = related_article.title;
				} else {
					logger.error(`related article has no title: ${related_article}`);
					continue;
				}

				if (related_article.url && typeof related_article.url === "string") {
					article.url = related_article.url;
				} else  if (related_article.href && typeof related_article.href === "string") {
					article.url = related_article.href;
				} else {
					logger.error(`related article has no url: ${related_article}`);
					continue;
				}

				if (related_article.slug && typeof related_article.slug === "string") {
					article.slug = related_article.slug;
				}

				this.related_articles.push(article);
			}
		}

		if (yaml.favicon && typeof yaml.favicon === "string") {
			this.favicon = yaml.favicon;
		}

		if (yaml.keywords && Array.isArray(yaml.keywords)) {
			let keywords = [];
			for (let keyword of yaml.keywords) {
				if (typeof keyword === "string") {
					keywords.push(keyword);
				}
			}
			this.meta.keywords = keywords.join(", ");
		}
		if (yaml.keyword && typeof yaml.keyword === "string") {
			this.meta.keywords = yaml.keyword;
		}

		if (yaml.description && typeof yaml.description === "string") {
			this.meta.description = yaml.description;
			this.meta["og:description"] = yaml.description;
			this.meta["twitter:description"] = yaml.description;
		}

		if (yaml.subject && typeof yaml.subject === "string") {
			this.meta["page-subject"] = yaml.subject;
		}

		if (yaml.image && typeof yaml.image === "string") {
			this.meta["og:image"] = yaml.image;
			this.meta["twitter:image"] = yaml.image;
		}

		if (yaml.meta && typeof yaml.meta === "object") {
			for (let key in yaml.meta) {
				this.meta[key] = yaml.meta[key];
			}
		}

		if (yaml.additional_head_content && typeof yaml.additional_head_content === "string") {
			//this.additional_head_content = yaml.additional_head_content;
			this.additional_head_content += yaml.additional_head_content;
		}
	}

	get body() : string {
		let html = "";

		html += this.header.html;

		if (this.url) {
			html += this._article_url_topnav;
		}

		html += `<div class="top-notice orange"><b>experiemntal</b></div>`

		html += this._content_html;

		html += `<script src="/js/index.js"></script>`;
		
		return html;
	}

	private get _article_url_topnav() : string {
		let html = "";

		let url_elems = this.url.split("/");

		// if last elem is empty, remove it
		if (url_elems[url_elems.length - 1] === "") {
			url_elems.pop();
		}

		let url = "";
		for (let elem of url_elems) {

			let elem_name = elem;
			if (elem_name == "") {
				elem_name = "/";
			}

			if (url.endsWith("/")) {
				url += elem;
			} else {
				url += "/" + elem;
			}

			html += `<a href="${url}">${elem_name}</a>`;
		}

		return `<lc-topnav><div>${html}</div></lc-topnav>`;
	}

	private get _content_html() : string {
		return `<lc-content>
	<lc-sidebar>
${this._related_articles_box}
	</lc-sidebar>
	<article>
${this.article_html}

${this._tmp_bottom}
	</article>
	<lc-nav-index></lc-nav-index>
</lc-content>`;
	}

	private get _tmp_bottom() : string {
		let html = "<hr>";

		html += '<a href="https://github.com/OpenPhysicsNotes/openphysicsnotes">github</a>\n';

		if (this.local) {
			html += `<a href="file:///${this.fileUrl}">local</a>\n`;
			html += `<a href="vscode://${this.fileUrl}" id="edit-link">local</a>\n`;
		} else {
			html += `<a href="https://github.com/OpenPhysicsNotes/openphysicsnotes/blob/main/content${this.fileUrl}">source</a>\n`;
			html += `<a href="https://github.dev/OpenPhysicsNotes/openphysicsnotes/blob/main/content${this.fileUrl}" target="_blank" id="edit-link">edit</a>\n`
		}

		html += `<a href="${this.url}?raw">raw source</a>\n`;

		html += `<a id="view-source-link">raw page</a>\n`;

		/*<a href="https://github.dev/OpenPhysicsNotes/openphysicsnotes/tree/main/content${this.fileUrl}" id="edit-link">edit</a>*/

		return html;
	}

	private get _related_articles_box() : string {

		if (this.related_articles.length <= 0) {
			return "";
		}

		let html = "";

		html += "<h2>Related articles</h2>";

		html += "<ul>";
		for (let article of this.related_articles) {
			html += `<li><a href="${article.url}">${article.title}</a></li>`;
		}
		html += "</ul>";

		return `<div class="related-articles">${html}</div>`;
	}

	private _configure_scripts() {
		this.scripts.push({
			src: "https://cdn.jsdelivr.net/npm/tex-math@latest/dist/tex-math.js",
			async: true
		});
		this.scripts.push({
			src: "https://cdn.jsdelivr.net/npm/lc-ref@latest/dist/lc-ref.js",
			async: true
		});
		this.scripts.push({
			src: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js"
		});
		this.scripts.push({
			code: `//hljs.highlightAll();
document.addEventListener("DOMContentLoaded", function() {{
	document.querySelectorAll('code:not(.nohighlight)').forEach((block) => {{
		//hljs.highlightElement(block);
	}});
	// https://github.com/highlightjs/highlight.js/issues/1737
	document.querySelectorAll('code:not([class*="language-"])').forEach(function($) {
		$.className = $.className ? $.className + ' no-highlight' : 'no-highlight';
	});
	hljs.configure({cssSelector: 'code[class*="language-"]'});
	hljs.highlightAll();
}})
`
		});

		if (watcher_enabled) {
			this.scripts.push({
				src: "/socket.io.min.js"
			});
			this.scripts.push({
				code: `var socket = io();
socket.on('file-changed', function (msg) {
	console.log("file-changed:", msg);
	if (!document.hidden ) {
		location.reload();
	}
});`
			});
			// TODO https://stackoverflow.com/questions/39144227/get-list-of-all-js-files-loaded-on-a-web-page
			// only when necessary
		}

		// google programmable search engine
		this.scripts.push("https://cse.google.com/cse.js?cx=2f38dddaa15003883");
	}

	private _configure_styleSheets() {
		this.styleSheets.push("/style.css");
		this.styleSheets.push({
			css: `i-math {
	display: inline-block;
}
tex-math {
	display: block;
}`
		});

		this.styleSheets.push({
			src: "/gsc.css",
			atEndOfBody: true
		});
	}
}

export class MdArticlePage extends ArticlePage {

	set markdown_article(md : string) {
		let processed = mdTransformer.process(md);

		this.article_html_content = processed;

		// TODO META!
	};

	constructor() {
		super();
	}
}