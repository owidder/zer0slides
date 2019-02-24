# zer0slides

zer0slides is a small library to create HTML based slides especially (but not restricted to) for showing code.

## Get started

### Step 1: Create the host page

The host page is the one and only full fledged HTML file you (with head and body and the whole enchilada):
* The host page loads the needed CSS and JS files
* The host page references all the slides. A slide is a file with a fragment of HTML code

Here is the host page of the [zer0slides promo](https://owidder.github.io/zer0slides/build/promo/indexPublic.html)

```
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.0/build/static/css/z0.1.2.0.css" rel="stylesheet"></head>
<body>
<script>
    window.onload = function () {
        _0.addSlide("zer0slides-title", "Title");
        _0.addSlide("the-steps", "How to create your zer0slides code slide show?");
        _0.addSlide("host-page", "Create a host page");
        _0.addSlide("slide-html", "Create a small HTML file for each slide");
        _0.addSlide("content-slide", "The content slide");
        _0.addSlide("keys", "Some hotkeys");
        _0.addSlide("examples", "Some examples");
        _0.addSlide("downloads", "Downloads");
        _0.addSlide("credits", "Thanks to");

        _0.initReady();
    }
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/owidder/zer0slides@v1.2.0/build/static/js/z0.1.2.0.js"></script></body>
</html>

```

With `_0.addSlide("name of the slide HTML file w/o the extension", "description")` a slide is added to the slide show. 

The first parameter is the name of the HTML file of the slide. It has to be in the same directory as the host page.

### Step 2: Create the slide HTML files