# zer0slides

zer0slides is a small library to create HTML based slides especially (but not restricted to) for showing code.

## Get started

### Step 1: Create the host page

The host page is the one and only full fledged HTML file you need (with head and body and the whole enchilada):
* The host page loads the needed CSS and JS files
* The host page references all the slides. A slide is a file with a fragment of HTML code

Here is the host page of the [helloworld example](https://owidder.github.io/zer0slides/build/helloworld/indexPublic.html)

```
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.7.1/build/static/css/z0.1.7.1.css" rel="stylesheet"></head>
<body>
<script>
    window.onload = function () {
        _0.addSlide("helloworld-title", "Title");

        _0.initReady();
    }
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.7.1/build/static/js/z0.1.7.1.js"></script></body>
</html>

```

With `_0.addSlide("name of the slide HTML file w/o the extension", "description")` a slide is added to the slide show. 

* The first parameter is the name of the HTML file of the slide. 
It has to be in the same directory as the host page.
This file is explained in the next chapter.
* The second parameter is a description of this slide. 
Its main usage is for the automatically created content page (explained later)

At the end the `_0.initReady()` function has to be called.

### Step 2: Create the slide HTML files

A slide is just a file with some HTML fragment. It has to be in the same directory as the host page.

Here's the file `helloworld-title.html`:

```
<style>
    #__0__ .code {
        font-size: 6em;
    }

</style>

<div class="code"></div>
<h5>Use 'right'/'left' to change slides, 'down'/'up' to step forward/back.</h5>

<script>

    (function () {
        _0.codeJs(".code",
            "console.log(\"Hello\")\n" +
            "console.log(\"World\")");

        const steps = [];
        steps.push(_0.highlightLinesStep(".code", "1", "Hello", "top"));
        steps.push(_0.highlightLinesStep(".code", "2", "World", "bottom"));

        _0.setSteps(steps);

        ___();
    })()
</script>
```

Typically a slides HTML file has 3 sections:
* In the `<style>` section you can style your page. You should always prefix your CSS selectors with `#__0__`.
It will be replaced by the ID of your page (which is the first parameter of the `_0.addSlide`-function used in the host page)
 such that your styles will not cross pollinate other slides. But you don't have to bother with the ID. 
 A `div` with the ID will be automatically created around the HTML code of this file
* After that put in any HTML code you want. 
* In the `<script>` section you can put any JavaScript code you want
    * You should put the code in a function scope to make sure it does not interfere with the code of other slides
    * You have to call `___()` (the snake) when the code has run 
    (in async cases call the snake when all promises have been resolved)
    * The `_0` object has a lot of useful methods. Here are the following used:
        * `_0.codeJs(cssSelectorString, codeString)`: Show code with JavaScript syntax coloring. 
            * `cssSelectorString` is the CSS selector where to render the code 
        (inside the current slide, i.e. the selector does not have to include the slide ID). 
            * `codeString` is a string with the code (with `\n`-delimited lines)
        * `_0.highlightLinesStep(cssSelectorString, lineNumberString, tooltipTextString, placementString)`: Create a step to highlight one or more lines of the code. 
        A step is something that's performed by clicking the down arrow key. 
        I.e. with each key click the lines of the next `highlightLinesStep`-lines are highlighted (and the previous are de-highlighted) 
            * `cssSelectorString` is the CSS selector (same as above). 
            * `lineNumberString` contains the line numbers to highlight (starts with 0) e.g. "1" or "1-2" or "1-2, 5-6".
            Under the hood [Prism with the line highlight plugin](https://prismjs.com/plugins/line-highlight/) is used. 
            WATIAH (What's allowed there is allowed here) 
            * `tooltipTextString` is the text ot the tooltip
            * `placementString` is the placement of the tooltip ("top", "bottom", ...).
            Under the hood [Protip](https://github.com/wintercounter/Protip#list-of-available-positions) is used.
            WATIAH
         * `_0.setSteps(stepsArray)`: Set the steps of this slide. 

### Step 3
Nothing. That's all. When you now serve the direcory with the host page and the slide HTML file you 
should see [this](https://owidder.github.io/zer0slides/build/helloworld/indexPublic.html).         

## Hotkeys

* -> / <- key
    * next slide / previous slide (with slide transition)
* 'k' / 'j'
    * next slide / previous slide (w/o slide transition)
* down / up key or 'm' / 'j'
    * next step / previous step (only when the down / up arrows appear at the right top corner)
* 'r'
    * redraw the current slide (w/o reloading the page, current step stays)
* 't'
    * redraw the current (with reloading the page, goes back to step 0)
* '0'
    * go back to the first slide (with reloading the page)
* '9'
    * open the content slide in a new tab
        * on the content slide move via up / down keys to the slide you wanna open
        * press 'enter' to open the slide on the same tab
        * click on the tooltip to open the slide in a new tab

## Examples

See the following example slides:
* [Hello World](https://owidder.github.io/zer0slides/build/helloworld/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/helloworld)
* [Promo](https://owidder.github.io/zer0slides/build/promo/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/promo)
* [JavaScript blockchain clients](https://owidder.github.io/zer0slides/build/blockchain/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/blockchain)
* [D3 (unfinished)](https://owidder.github.io/zer0slides/build/d3/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/d3)

## All features of the `_0` object

### Show code

There are currently 3 functions to show code with different syntax coloring:

* `_0.codeBash(selectorString, codeString, optionsObject)`
* `_0.codeCss(selectorString, codeString, optionsObject)`
* `_0.codeJs(selectorString, codeString, optionsObject)`
    * `selectorString`: CSS selector where to place the code.
    The selected element has to be inside the slide, since it'll
    automatically be prepended by the ID of the slide
    * `codeString`: String with the code to show. 
    Lines have to be `\n`-delimited
    * `optionsObject`
        * `optionsObject.backgroundColor`: name of the background color (default is `"transparent"`)
        * `optionsObject.lineNumbers`: `true` (default) to show line numbers