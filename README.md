# AndMrKow-markdownToHtml
(**AndMrKow** is an anagram of **markdown**)

It's a simple tool to translate markdown into html.

------
**andmrkow.js, to be used with Javascript**
**andmrkow.node.js, to be used with node.js**

### Functions :
**render(text, params = {})** *translate markdown into html*

*examples :*

`render("hello world! i'm using **AndMrKow!**")`
return : `{text: "<p>hello world! i'm using <strong>AndMrKow!</strong><p>"}`

#### Params :

    params = {
        "shiftTitles": true, // shift th titles : h1 became h2, h2 => h3... /!\ : h6 => h6
        "sharpBefore": true, // add a sharp before the title
        "titleAnchor": true, // title is a link with anchor
        "withSyntaxeElements": true, // show markdown syntax elements
        "noImages": true, // replace images by the text "Images are not allowed..."
        "noTitles": true, // replace titles by a <strong> text
        "ugc": true, // add ugc attribute to link and PREVENT XSS (REMOVE HTML TAG)
        "getFirstImage": true // return the first image (return : {text: "your parsed markdown", firstImage: "https://path.to.your.first.image"})
    }

**/!\\** If withSyntaxeElements = true, there will be no sharp before


**whitout = (text, lenght = "all")** *remove markdown syntax elements*
*examples :*

`without("hello world! i'm using **AndMrKow!**")`
return : `hello world! i'm using AndMrKow!`

`without("hello world! i'm using **AndMrKow!**", 10)`
return : `hello worl`

**slugify = (text)** *slugify a string*
*examples :*

`slugify("Titre de niveau 1")`
return : `titre-de-niveau-1`