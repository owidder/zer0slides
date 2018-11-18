### Introduction

* 'zer0slides' is a JavaScript libray to create slide based on HTML / CSS / JavaScript
* It's especially made to create slides showing and explaining code (with tooltips)
* It's currently in pre alpha. More to come soon
* To get a very first intruduction watch this promo (it's dogfoody and made with 'zer0slides' itself):
https://owidder.github.io/zer0slides/promo/promo.html

### Usage

* Import the zerOslide script at the end of the body section:
```
...
<script src="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v0.0.7/dist/z0.js"></script>
</body>
```
* Link the the css somewhere in the head section:
```
<link href="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v0.0.7/dist/z0.css" rel="stylesheet">
```
* See the promo on how to create the host page and the slide html files: https://owidder.github.io/zer0slides/promo/promo.html
* Example of a host page: https://github.com/owidder/zer0slides/blob/master/promo/promo.html
* Example of a slide html file: https://github.com/owidder/zer0slides/blob/master/promo/slide-html.html 

### API

Under `window` there is an object named `_0`

The current API is quite limited but will grow soon.

And of course you do anything HTML / CSS / JavaScript can do. 
Use any library you like (d3, jQuery, ...).
The sky (and maybe the browser) is the limit.

#### addSlide

```
_0.addSlide(slideName: string)
```

Add a slide to the slide show.
* **slideName**: Name of the filename of the html file of the slide (w/o the html extension)

Example: https://github.com/owidder/zer0slides/blob/master/promo/promo.html#L11

### codeJs

```
_0.codeJs(selector: string, code: string)
```

Show code with JavaScript syntax coloring.
* **selector**: css selector of the dom element where the code will be shown (inside the html of the slide)
* **code**: The code itself. Each line has to be finished with '\n'

Example: https://github.com/owidder/zer0slides/blob/master/promo/zer0slides-title.html#L16

### codeCss

```
_0.codeCss(selector: string, code: string)
```

Same as `codeJs` but with CSS syntax coloring

### codeBash

```
_0.codeBash(selector: string, code: string)
```

Same as `codeJs` but with Bash syntax coloring

#### highlightLines

```
_0.highlightLines(selector: string, lines: string, tooltip?: string, position?: string, placement?: string)
```

Highlight lines inside the code

* **selector**: CSS selector (inside the html of the slide) where the code is
* **lines**: Lines to highlight. Examples "1", "1-5" etc.
* **tooltip**: Tooltip text
* **position**: Position of the tooltip text: "top", "bottom" (see: http://protip.rocks/)
* **placement** Placement of the tooltip: "inside", "outside" (see: http://protip.rocks/)

#### highlightLinesStep

```
_0.highlightLinesStep(selector: string, lines: string, tooltip?: string, position?: string, placement?: string)
```

Same as `highlightLines` but creates a step to highlight lines. 

Example: https://github.com/owidder/zer0slides/blob/master/promo/slide-html.html#L11

### setSteps

```
_0.setSteps(steps: Step[])
```

Set the steps of the current slide. A `Step` is the thingy being returned by `highlightLinesStop`

Example: https://github.com/owidder/zer0slides/blob/master/promo/slide-html.html#L21

#### readFile

```
_0.readFile(path: string)
```

Reads a file and returns a promise which resolves the string

* **path**: Relative path to the file

Example: https://github.com/owidder/zer0slides/blob/master/promo/slide-html.html#L7

#### showText

```
_0.showText(selector: string, text: string)
```

Shows the given `text` inside the DOM element with the given `selector`

* **selector**: Selector of the DOM element (inside the html of the slide)
* **text**: Text to show

Example: https://github.com/owidder/zer0slides/blob/master/promo/qr.html#L35

#### setAttribute

```
_0.setAttribute(selector: string, attributeName: string, text: string)
```

Sets an attribute at the DOM element with the given `selector`

* **selector**: Selector of the DOM element (inside the html of the slide)
* **attributeName**: Name of the attribute to set
* **text**: Value of the attribute