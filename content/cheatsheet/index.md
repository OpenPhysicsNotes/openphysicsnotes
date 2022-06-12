---
title: OPN Demo
related_articles:
    - title: Writing plain THML
      href: ./plain_html.md
---

# Cheatsheet

The *Open Physics Notes* server uses the [markdown-it](https://npmjs.org/package/markdown-it) library to render the content.

It supports most of the [GFM](https://github.github.com/gfm/) syntax, but we also add some custom features to help you write your notes.

## Basic elements

### Newlines

You can use **double spaces** at the end of a line to create a new line. You can also use the `<br>` tag to create a new line.

::: todo
add `\n` and `\\`.
:::

### Paragraphs

You can use **two blank lines** to separate paragraphs. You can also use the `<p>` tag to create a new paragraph, but this is not advised.

### Headings

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
normal text
```

is equivalent to

```html
<h1>H1</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
<h6>H6</h6>
normal text
```

and renders as:

<div class="render-preview" style="font-size: 75%;">
<h1>H1</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
<h6>H6</h6>
normal text
</div>

### Bold and Italic

```md
**strong**
*emphasis*
```

is equivalent to

```html
<strong>strong</strong> (style equivalent to <b>bold</b>)
<em>emphasis</em> (style equivalent to <i>italic</i>)
```

### Links

```md
[link](http://example.com)
```

is equivalent to

```html
<a href="http://example.com">link</a>
```

:smile: :warning: s:b:innala

## Utility elements

### Equations

we support [pandoc](http://pandoc.org/README.html#math) flavoured equations, i.e. using the `$...$` and `$$...$$`.

```md
inline equation: $x^2$  
display equation: $$x^2$$
```

that is equivalent to:
```html
inline equation: <i-math>x^2</i-math>
display equation: <tex-math>x^2</tex-math>
```

that renders as:
<div class="render-preview">
    inline equation: <i-math>x^2</i-math><br>
    display equation: <tex-math>x^2</tex-math>
</div>

You can add numbering to your equations by giving them an `id` or adding the `n` or `numbered` attribute:

```html
<tex-math>x^2</tex-math>
<tex-math id="eq:some-id">x^2</tex-math>
<tex-math id>x^2</tex-math>
<tex-math n>x^2</tex-math>
<tex-math numbered>x^2</tex-math>
```

that renders as:
<div class="render-preview">
    <tex-math>x^2</tex-math>
    <tex-math id="eq:some-id">x^2</tex-math>
    <tex-math id>x^2</tex-math>
    <tex-math n>x^2</tex-math>
    <tex-math numbered>x^2</tex-math>
</div>

You can also style equations using css:
```html
<tex-math style="border: 1px solid red;">x^2</tex-math>
```
<div class="render-preview">
<tex-math style="border: 1px solid red; background: rgba(0, 255, 255, 0.125); color: cyan;">x^2</tex-math>
</div>

You can reference an equation using the `lc-ref` tag:
```html
<lc-ref ref="eq:sme-equation">eq. </lc-ref>
<lc-ref href="#eq:sme-equation">eq. </lc-ref>
```
<div class="render-preview">
<lc-ref ref="eq:some-id">eq. </lc-ref>
<lc-ref href="#eq:some-id">eq. </lc-ref>
</div>

::: note
You can **hover** a reference with your mouse to see the equation preview.

::: todo
`tip` block here instead of `note`
:::

:::

::: todo
some markdown equivalent or authomatic link transform
:::

::: todo
explain that you can also reference equations in external documents using `<lc-ref href="some/page#eq:some-id">eq. </lc-ref>` syntax
:::

## Some OPN specific utility elements

### Courses Timeline

Sometimes we want to show a timeline of the courses that we advise the students to take. To do so, we can use the following syntax:

```html
<div class="courses-timeline">
    <div class="course" style="grid-column: 1 / 2;"><a href = "#">Corso A</a></div>
    <div class="course" style="grid-column: 2 / 3;"><a href = "#">Corso B</a></div>
    <div class="course" style="grid-column: 1 / 3;"><a href = "#">Corso Semestrale</a></div>
    <div class="course" style="grid-column: 1 / 3;"><a href = "/QM">Quantum Mechanics</a></div>
    <div class="course" style="grid-column: 2 / 3;"><a href = "#">Corso C</a></div>
    <div class="course" style="grid-column: 2 / 4;"><a href = "/demo">Corso che va fuori</a></div>
</div>
```
this will render as:
<div class="render-preview">
    <div class="courses-timeline">
        <div class="course" style="grid-column: 1 / 2;"><a href = "#">Corso A</a></div>
        <div class="course" style="grid-column: 2 / 3;"><a href = "#">Corso B</a></div>
        <div class="course" style="grid-column: 1 / 3;"><a href = "#">Annual course</a></div>
        <div class="course" style="grid-column: 1 / 3;"><a href = "/QM">Quantum Mechanics</a></div>
        <div class="course" style="grid-column: 2 / 3;"><a href = "#">Semestral course</a></div>
        <div class="course" style="grid-column: 2 / 4;"><a href = "/demo">Corso che va fuori</a></div>
    </div>
</div>

::: todo
enable this syntax:
```md
[:timeline]

[:timeline]

[:timeline]
```
:::


---
---
---
