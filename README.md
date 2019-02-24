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
<link href="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.2/build/static/css/z0.1.2.2.css" rel="stylesheet"></head>
<body>
<script>
    window.onload = function () {
        _0.addSlide("helloworld-title", "Title");

        _0.initReady();
    }
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.2/build/static/js/z0.1.2.2.js"></script></body>
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

A slide is just a file with some HTML fragment.

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

Normally a slides HTML file has 3 sections:
* In the `<style>` section you can style your page. You should always prefix your CSS selectors with `#__0__`.
It will be replaced by the ID of your page such that your styles will not cross pollinate other slides.
* After that put in any HTML code you want
* In the `<script>` section you can put any JavaScript code you want
    * You should put the code in a function scope to make sure it does not interfere with the code of other slides
    * You have to call `___()` (the snake) when the code has run 
    (in async cases call the snake when all promises have resolved)
    * The `_0` object has a lot of useful methods. Here:
        * `_0.codeJs`: Show JavaScript code. The first parameter is the CSS selector where to render the code 
        (on the current slide). The second parameter is a string with the code (the lines are `\n` delimited)
        * `_0.highlightLinesStep`: Create a step to highlight one or more lines of the code. 
        The first parameter is the CSS selector (see above). The second parameter is the line number (e.g. "1")
        or more lines (e.g. "1-2, 5-6")
        * The third parameter is the text ot the tooltip
        * The fourth parameter is the placement of the tooltip ("top", "bottom")
        
... TO BE CONTINUED ...

See the following example slides:
* [Hello World](https://owidder.github.io/zer0slides/build/helloworld/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/helloworld)
* [Promo](https://owidder.github.io/zer0slides/build/promo/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/promo)
* [JavaScript blockchain clients](https://owidder.github.io/zer0slides/build/blockchain/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/blockchain)
* [D3 (unfinished)](https://owidder.github.io/zer0slides/build/d3/indexPublic.html)
    * [Slides are here](https://github.com/owidder/zer0slides/tree/master/public/d3)
