# zer0slides

zer0slides is a small library to create HTML based slides especially (but not restricted to) for showing code.

## Get started

### Step 1: Create the host page

The host page is the one and only full fledged HTML file you (with head and body and the whole enchilada):
* The host page loads the needed CSS and JS files
* The host page references all the slides. A slide is a file with a fragment of HTML code

Here is the host page of the [helloworld example](https://owidder.github.io/zer0slides/build/helloworld/indexPublic.html)

```
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.1/build/static/css/z0.1.2.1.css" rel="stylesheet"></head>
<body>
<script>
    window.onload = function () {
        _0.addSlide("helloworld-title", "Title");

        _0.initReady();
    }
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.1/build/static/js/z0.1.2.1.js"></script></body>
</html>

```

With `_0.addSlide("name of the slide HTML file w/o the extension", "description")` a slide is added to the slide show. 

* The first parameter is the name of the HTML file of the slide. 
It has to be in the same directory as the host page.
This file is explained in the next chapter.
* The second parameter is a description of this slide. 
Its main usage is for the automatically created content page (explained later)

### Step 2: Create the slide HTML files

