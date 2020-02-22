# AndMrKow-markdownToHtml
(**AndMrKow** is an anagram of **markdown**)

It's a simple tool to translate markdown into html.

------
**andmrkow.js, to be used with Javascript**
**andmrkow.node.js, to be used with node.js**

## Functions :
**render(text, params = {})** *translate markdown into html*

*examples :*

`render("hello world! i'm using **AndMrKow!**")`
return : `{text: "<p>hello world! i'm using <strong>AndMrKow!</strong><p>"}`

**Params :**

    params = {
        "shiftTitles": true, // shift the titles : h1 became h2, h2 => h3... /!\ : h6 => h6
        "sharpBefore": true, // add a sharp before the title
        "titleAnchor": true, // title is a link with anchor
        "withSyntaxeElements": true, // show markdown syntax elements
        "noImages": true, // replace images by the text "Images are not allowed..."
        "noTitles": true, // replace titles by a <strong> text
        "ugc": true, // add ugc attribute to all links
        "getFirstImage": true // return the first image and the alt (return : {text: "your parsed markdown", firstImage: "https://path.to.your.first.image", , firstImageAlt: "your cool image"})
    }

**/!\\** If withSyntaxeElements = true, there will be no sharp before

___
**whitout = (text, lenght = "all")** *remove markdown syntax elements*
*examples :*

`without("hello world! i'm using **AndMrKow!**")`
return : `hello world! i'm using AndMrKow!`

`without("hello world! i'm using **AndMrKow!**", 10)`
return : `hello worl`

___
**getFirstImage = (text)** *return the first image (and alt) of a markdown string*
*examples :*

`getFirstImage("Voici une image : ![Logo chevro.fr](https://chevro.fr/files/favicon/favicon.ico)")`
return : `{path: "https://chevro.fr/files/favicon/favicon.ico", alt: "Logo chevro.fr"}`

if there is no image in the markdown string, the output will be : `{}`

**slugify = (text)** *slugify a string*
*examples :*

`slugify("Titre de niveau 1")`
return : `titre-de-niveau-1`

## Authors

* **CESTOLIV** - [@cestoliv](https://github.com/cestoliv)

See also the list of [contributors](https://github.com/cestoliv/bluewrite-client-web/contributors) who participated in this project.

## License

This project is licensed under the IOPL - see the [LICENSE.md](LICENSE.md) file for details