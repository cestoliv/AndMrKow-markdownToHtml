# AndMrKow-markdownToHtml
(**AndMrKow** is an anagram of **makdown**)

It's a simple tool to translate markdown into html.

------
**andmrkow.js, to be used with Javascript**
**andmrkow.node.js, to be used with node.js**

### Functions :
**render(text, params = {})** *translate markdown into html*

*examples :*

`render("hello world! i'm using **AndMrKow!**")`
return : `<p>hello world! i'm using <strong>AndMrKow!</strong><p>`

#### Params :

    params = {
        "shiftTitles": true, // shift th titles : h1 became h2, h2 => h3... /!\ : h6 => h6
        "sharpBefore": true, // add a sharp before the title
        "titleAnchor": true, // title is a link with anchor
        "withSyntaxeElements": true, // show markdown syntax elements
    }

**/!\\** If withSyntaxEElements = true, there will be no sharp before


**whitout = (text, lenght = "all")** *remove markdown syntax elements*
*examples :*

`without("hello world! i'm using **AndMrKow!**")`
return : `hello world! i'm using AndMrKow!`

`without("hello world! i'm using **AndMrKow!**", 10)`
return : `hello worl`

## SUPPORTS
### Headers
Use 1-6 hash characters at the start of the line, corresponding to header levels 1-6.

`# This is an H1` >> `<h1>This is an H1</h1>`

`## This is an H2` >> `<h2>This is an H2</h2>`

`###### This is an H6` >> `<h6>This is an H6</h6>`

### Bold
Surrounding words with two asterisks or two underscores (on each side) will put them in bold.

`Here is a **text in bold**.` >> `<p>Here is a <strong>text in bold</strong>.</p>`

`Here are **two texts** in __bold__.` >> `<p>Here are <strong>two texts</strong> in <strong>bold</strong>.</p>`

### Italics
Surrounding words with an asterisk or bottom dash (on each side) will put them in italics.

`Here is an *italicized text*.` >> `<p>Here is an <em>italicized text</em>.</p>`

`Here *are two* italic _text_.` >> `<p>Here <em>are two</em> italic <em>text</em>.</p>`

### Code block
Indenting in front of a line will make a block of code (after a line break, otherwise, it's just an indentation).

`   console.log("hello world!")` >> `<pre><code>console.log("hello world!")</code></pre>`

	if(you like this) {
    	return(star the project !)
  	}

will produce :

    <pre><code>if(you like this) {
        return(star the project !)
    }</code></pre>

### Inline code
Surrounding words with `` ` `` turns them into code.

``Small piece of `code`.`` >> `<p>Small piece of <code>code</code>.</p>`

### Links
There is a special syntax for creating a link: **\[Text\]\(https://chevro.fr\)** and an optional argument **(blank)**, to add a `target =" _ blank "` parameter to the link.

**/!\\**AndMrKow adds **rel="noopener, noreferrer"** parameters to links

`Here is a link to [GitHub](https://github.com).` >> `<p>Here is a link to <a href="https://github.com" rel="noopener, noreferrer">GitHub</a>.</p>`

`Here is a link to [GitHub](https://github.com)(blank) with a target="_blank" parameter.` >> `<p>Here is a link to <a href="https://github.com" rel="noopener, noreferrer" target="_blank">GitHub</a>.</p>`

### Images
The special syntax of the images is similar to that of the links : **\!\[Description / title\]\(link to the image\)**. 
Beware of the exclamation mark at the beginning.

`![chevro logo](https://chevro.fr/files/favicon/android-chrome-512x512.png)` >> `<img src="https://chevro.fr/files/favicon/android-chrome-512x512.png" alt="chevro logo" />`

### Comments
Start a line with a **double slash** that turns it into a comment. It will not be visible in the HTML code.
`//Here is a cool comment!` >> ""