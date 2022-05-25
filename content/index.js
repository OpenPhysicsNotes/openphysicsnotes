
var index_elements = []

var id_counter = 0

/**
 * creates an incremental id
 * @returns {string}
 */
function make_id() {
    return "tmp_ID_" + (id_counter++).toString()
}

/**
 * 
 * @param {HTMLElement} element 
 */
function element_id(element) {
    if (element.id.length <= 0) {
        element.id = make_id()
    }
    return element.id;
}

function make_index() {

    /** @type {HTMLElement} */

    /** @var {HTMLElement | Null} article ciao */
    let article = document.getElementsByTagName("article")[0]
    
    let index = document.getElementsByTagName("lc-nav-index")[0]
    index.innerHTML = ""
    let index_a = document.createElement("aside")
    index.appendChild(index_a)
    index_a.innerHTML += "<h3>In this article</h3>"
    index_elements = []

    //let cc = article.querySelectorAll("h2, h3")
    // see https://stackoverflow.com/questions/3680876/using-queryselectorall-to-retrieve-direct-children
    let cc = article.querySelectorAll(":scope > h2, :scope >  h3")
    for (let c of cc) {
        e = document.createElement("li")
        a = document.createElement("a")
        e.appendChild(a)
        a.innerHTML = c.innerHTML
        a.setAttribute("href", "#" + element_id(c))
        e.data_element = c
        c.data_index_element = e
        index_a.appendChild(e)
        index_elements.push(e)
        //e.addEventListener("click", function() {
        //    window.scrollTo(c.getBoundingClientRect().x, c.getBoundingClientRect().y);
        //})

        if (c.tagName == "H3") {
            e.className = "sub"
        }

    }
}

function onscroll() {
    lastKnownScrollPosition = window.scrollY;

    for (let e of index_elements) {
        e.removeAttribute("active");
    }

    for (let i = 0; i < index_elements.length; i++) {
        e = index_elements[i].data_element
        if (i == 0) {
            if (lastKnownScrollPosition <= e.getBoundingClientRect().y) {
                e.data_index_element.setAttribute("active", "")
                /*
                https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                https://stackoverflow.com/questions/56688002/javascript-scrollintoview-only-in-immediate-parent
                ma non funziona...
                */
                //e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            }
        }
        if (i == index_elements.length - 1) {
            if (lastKnownScrollPosition >= e.getBoundingClientRect().y) {
                e.data_index_element.setAttribute("active", "")
                //e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            }
        } else {
            e2 = index_elements[i + 1].data_element
            if (lastKnownScrollPosition >= e.getBoundingClientRect().y && lastKnownScrollPosition < e2.getBoundingClientRect().y) {
                e.data_index_element.setAttribute("active", "")
                //e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
            }
        }
    }
}

// ================================================================

var lc_fig_counter = 0;

/**
 * A lc-figure component.
 * 
 * slots:
 *  - graphics
 *  - caption
 * 
 * if no ID is specified, a unique ID is generated
 */
class LCFigure extends HTMLElement {
    constructor() {
        super();

        this.fig_number = ++lc_fig_counter;

        if (this.id.length <= 0) {
            this.id = "fig_" + this.fig_number;
        }

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML += "<style>a { color: var(--link-color)}</style>"

        this.content = document.createElement("div");
        let content = this.content;
        this.shadowRoot.appendChild(content);
        content.style.display = "flex"
        content.style.gap = "0.5em"
        content.style.flexDirection = "column";
        content.style.alignContent = "center";

        let graphics = document.createElement("slot");
        content.appendChild(graphics);
        graphics.name = "graphics";

        let description = document.createElement("div");
        content.appendChild(description);
        description.style.fontSize = "75%";

        description.innerHTML = 'Fig. <a href="#' + this.id + '">' + this.fig_number + "</a>: ";
        let caption = document.createElement("slot");
        description.appendChild(caption);
        caption.name = "caption";
        //label.style.fontStyle = "italic";
        description.style.maxHeight = "10em";
        description.style.overflow = "auto";
    }
}
customElements.define('lc-figure', LCFigure);

// ================================================================

make_index()
onscroll()
document.addEventListener("scroll", onscroll)

// ================================================================