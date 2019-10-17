//AndMrKow-markdownToHtml

exports.render = (text, params = {}) => { // translate markdown into html
    //text = text.replace(/ /g, "&nbsp;") // replace all the space by html space (for allowing multiple space)
    if(params["ugc"]) { // if ugc
        // replace < and > for don't allow html tag and prevent XSS
        text = text.replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
    }
    

    var parsedText = "" // will contain all the html text to return

    var lines = text.split(/\r\n|\r|\n/) // create an array of each lines

    //VARS
    var isCode = false // will be true if we are in a text block

    for(line in lines) { // browse lines (line is the index)
        var noP = false // will be true if the current line must not be surrounded by <p> tags
        var isComment = false // will be true if the current line is a comment
        var regex, found // regex : contain the regex, found : contain results of regex match

        lines[line] = escapeChars(lines[line])
    //COMMENT
        if(/^\/\/(.+)/.exec(lines[line])) { // if the current line start with a double slash
            if(!params["withSyntaxeElements"]) { // if syntaxe elements should not be shown, otherwise we do nothing (we keep the comment).
                isComment = true // current line is a comment
                noP = true // current line don't need to be surronded with <p> tags (because she's empty)
                lines[line] = "" //empty the line
            }
        }
    //CODE BLOCK
        if(/^\t(.+)/.exec(lines[line])) { // search if current line begins with an indentation
            if((lines[line -1] == "" || lines[line -1] == null) || isCode) { // if we are after a line break or in the code (isCode)
                if(!isCode) { // if the previous line wasn't a code
                    parsedText += "<pre><code>" // add start code block
                    isCode = true // say that this is the beginning of a block of code
                }
                noP = true // code block don't need to be surronded by <p> tags
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    lines[line] = "\t" + RegExp.$1 + '\n' // re-add the start indentation
                }
                else  {
                    lines[line] = RegExp.$1 + '\n'
                }
            }
            else { // it's mean it's juste an indentation
                lines[line] = lines[line].replace(/\t/g, "&emsp;&emsp;") // add tab space before the text
            }
        }
        else { // if current line is not a part of code
            lines[line] = lines[line].replace(/\t/g, "&emsp;&emsp;") // add tab space before the text
            if(isCode) { // if the previous line was a part of code
                parsedText += "</code></pre>" // close the code block
                isCode = false // say the current line is not a part of code
            }

        //INLINE CODE
            regex = /`(.+?)`/g // search if word/sentence is surronded by `
            found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
            for(i in found) { // read found array
                let data = regex.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

                let text = RegExp.$1 // text = the text between the `
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "`" + text + "`" // surrond text by `
                }
                lines[line] = lines[line].replace("`" + RegExp.$1 + "`", "<code>" + text + "</code>") // replace old word by the text surronded by <code> tags
            }

        //BOLD
            regex = /\*\*(.+?)\*\*/g // search if word/sentence is surronded by **
            found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
            for(i in found) { // read found array
                let data = /\*\*(.+?)\*\*/.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

                let text = RegExp.$1 // text = the text between the **
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "**" + text + "**" // surrond text by **
                }
                lines[line] = lines[line].replace("**" + RegExp.$1 + "**", "<strong>" + text + "</strong>") // replace old word by the text surronded by <strong> tags
            }
            regex = /\_\_(.+?)\_\_/g // search if word/sentence is surronded by __
            found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
            for(i in found) { // read found array
                let data = /\_\_(.+?)\_\_/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

                let text = RegExp.$1 // text = the text between the __
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "__" + text + "__" // surrond text by __
                }
                lines[line] = lines[line].replace("__" + RegExp.$1 + "__", "<strong>" + text + "</strong>") // replace old word by the text surronded by <strong> tags
            }
        //EMPHASE
            regex = /\*(.+?)\*/g // search if word/sentence is surronded by *
            found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
            for(i in found) { // read found array
                let data = /\*(.+?)\*/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

                let text = RegExp.$1 // text = the text between the *
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "*" + text + "*" // surrond text by *
                }
                lines[line] = lines[line].replace("*" + RegExp.$1 + "*", "<em>" + text + "</em>") // replace old word by the text surronded by <em> tags
            }
            regex = /\_(.+?)\_/g // search if word/sentence is surronded by _
            found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
            for(i in found) { // read found array
                let data = /\_(.+?)\_/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

                let text = RegExp.$1 // text = the text between the _
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "_" + text + "_" // surrond text by _
                }
                lines[line] = lines[line].replace("_" + RegExp.$1 + "_", "<em>" + text + "</em>") // replace old word by the text surronded by <em> tags
            }
        //HEADERS
            /*h1*/
            if(/^# (.+)$/.exec(lines[line])) { // search if the current line start with "# "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "# " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = params["shiftTitles"] ? '<h2 id="' + slugTitle + '">' : '<h1 id="' + slugTitle + '">' // if in params, h1 => h2
                let endbal = params["shiftTitles"] ? '</h2>' : '</h1>' // if in params, h1 => h2
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("# " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag
            }
            /*h2*/
            if(/^## (.+)$/.exec(lines[line])) { // search if the current line start with "## "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "## " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = params["shiftTitles"] ? '<h3 id="' + slugTitle + '">' : '<h2 id="' + slugTitle + '">' // if in params, h2 => h3
                let endbal = params["shiftTitles"] ? '</h3>' : '</h2>' // if in params, h2 => h3
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("## " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag
            }
            /*h3*/
            if(/^### (.+)$/.exec(lines[line])) { // search if the current line start with "### "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "### " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = params["shiftTitles"] ? '<h4 id="' + slugTitle + '">' : '<h3 id="' + slugTitle + '">' // if in params, h3 => h4
                let endbal = params["shiftTitles"] ? '</h4>' : '</h3>' // if in params, h3 => h4
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("### " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag
            }
            /*h4*/
            if(/^#### (.+)$/.exec(lines[line])) { // search if the current line start with "#### "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "#### " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = params["shiftTitles"] ? '<h5 id="' + slugTitle + '">' : '<h4 id="' + slugTitle + '">' // if in params, h4 => h5
                let endbal = params["shiftTitles"] ? '</h5>' : '</h4>' // if in params, h4 => h5
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("#### " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag  
            }
            /*h5*/
            if(/^##### (.+)$/.exec(lines[line])) { // search if the current line start with "##### "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "##### " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = params["shiftTitles"] ? '<h6 id="' + slugTitle + '">' : '<h5 id="' + slugTitle + '">' // if in params, h5 => h6
                let endbal = params["shiftTitles"] ? '</h6>' : '</h5>' // if in params, h5 => h6
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("##### " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag  
            }
            /*h6*/
            if(/^###### (.+)$/.exec(lines[line])) { // search if the current line start with "###### "
                noP = true // headers should not be surronded by <p> tags
                let title = RegExp.$1 // Get the title text
                let slugTitle = this.slugify(title) // Get the title slug
                let text = params["withSyntaxeElements"] ? "###### " + title : title // text = "## + title"  if syntax element should be shown, otherwise, text = title
                if(params['sharpBefore'] && !params['withSyntaxeElements']) { text = "# " + text } // if in params, add sharp before the title
                if(params['titleAnchor']) { text = '<a href="#' + slugTitle + '">' + text + "</a>"} // if in params, add link to the anchor
                let bal = '<h6 id="' + slugTitle + '">' // h6 => h6, so don't change
                let endbal = '</h6>' // h6 => h6, so don't change
                if(params["noTitles"]) { // if noTitles
                    bal = '<p><strong>' // p, because noTitles
                    endbal = '</strong></p>' // p, because noTitles
                }
                lines[line] = lines[line].replace("###### " + title, bal + text + endbal) // replace title in text by a title surronded by bal, the start tag, and enbal, the end tag  
            } 
        }

    //IMAGES
        regex = /!\[(.+?)\]\((.+?)\)/g // search if word/sentence respects the pattern ![title/desc](link)
        found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
        for(i in found) { // read found array
            let data = /!\[(.+?)\]\((.+?)\)/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

            if(params['noImages']) { // if noImages
                lines[line] = lines[line].replace("![" + RegExp.$1 +"](" + RegExp.$2 + ")", '<strong>Images are not allowed...</strong>') // replace old word by the image element
            } 
            else { // if images allowed
                let text = "" // text = the text in "alt" if withSyntaxElements is false, or the syntax element if is true
                if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                    text = "![" + RegExp.$1 + '](<a href="' + htmlspecialchars(RegExp.$2) + '" target="_blank" rel="noopener, noreferrer">' + RegExp.$2 + "</a>)" // re-add the syntax elements
                }
                lines[line] = lines[line].replace("![" + RegExp.$1 +"](" + RegExp.$2 + ")", text + '<img src="' + htmlspecialchars(RegExp.$2) + '" alt="' + RegExp.$1 + '" />') // replace old word by the image element
            }
        }

    //LINK
        regex = /\[(.+?)\]\((.+?)\)\((.+?)\)|\[(.+?)\]\((.+?)\)/g // search if word/sentence respects the pattern [title/desc](link) or [title/desc](link)(param)
        found = lines[line].match(regex) // put matching word/sentence of th current line in the found array
        for(i in found) { // read found array
            let data = /\[(.+?)\]\((.+?)\)\((.+?)\)|\[(.+?)\]\((.+?)\)/g.exec(found[i]) // actualize the regex (otherwise it keep the last matching word/sentence)

            if(lines[line][lines[line].indexOf(found[i]) - 1] != "!") { // search the caractere juste before the "[title/desc](link)", if it's a !, it's an images
                target = ""
                rel = "noopener, noreferrer"

                if(RegExp.$3.includes("blank")) { // if the params case contains "blank" attribute
                    target = '_blank' // add _blank to target
                }

                if(RegExp.$3.includes("ugc") || params['ugc']) { // if the params case contains "ugc" attribute
                    if(rel != "") {
                        rel += ', ' // add only if there is still something in rel
                    }
                    rel += "ugc" // add ugc to rel
                }

                if(RegExp.$3.includes("sponsored")) { // if the params case contains "sponsored" attribute
                    if(rel != "") {
                        rel += ', ' // add only if there is still something in rel
                    }
                    rel += "sponsored" // add sponsored to rel
                }

                if(RegExp.$3.includes("nofollow")) { // if the params case contains "nofollow" attribute
                    if(rel != "") {
                        rel += ', ' // add only if there is still something in rel
                    }
                    rel += "nofollow" // add nofollow to rel
                }

                if(RegExp.$3 == "") { // if link form is []()
                    let text = '<a href="' + htmlspecialchars(RegExp.$5) + '" rel="' + rel + '" target="' + target + '">' + RegExp.$4 + "</a>" // text = the link
                    if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                        text = "[" + RegExp.$4 + '](<a href="' + htmlspecialchars(RegExp.$5) + '" rel="' + rel + '" target="' + target + '">' + text + "</a>)" // text = the link with syntax element
                    }
                    lines[line] = lines[line].replace("[" + RegExp.$4 +"](" + RegExp.$5 + ")", text) // replace the old word/sentence by the link
                }
                else { // if link form is []()()
                    let text = '<a href="' + htmlspecialchars(RegExp.$2) + '" rel="' + rel + '" target="' + target + '">' + RegExp.$1 + "</a>" // text = the link (with target="_blank")
                    if(params["withSyntaxeElements"]) { // if syntaxe elements should be shown
                        text = "[" + RegExp.$1 + '](<a href="' + htmlspecialchars(RegExp.$2) + '" rel="' + rel + '" target="' + target + '">' + RegExp.$1 + "</a>)(" + RegExp.$3 + ")" // text = the link with syntax element (with target="_blank")
                    }
                    lines[line] = lines[line].replace("[" + RegExp.$1 +"](" + RegExp.$2 + ")(" + RegExp.$3 + ")", text) // replace the old word/sentence by the link
                }
            }
        }

        if((lines[line] == "" || lines[line] == null) && !isComment) { // if line is empty and is not a comment
            parsedText += "<br />" // add a <br /> tag
        }
        else {
            let parsedLine = lines[line]
            if(!noP) { // if need to be surronded by <p> tags
                parsedLine = "<p>" + parsedLine + "</p>" // surrond with <p> tags
            }
            parsedText += parsedLine // add line to text to return
        }    
    }

    return(parsedText) // return text
}

exports.without = (markdown, lenght = "all") => {
    var res = this.render(markdown).replace(/<\/p>/g, '\n')
    res = res.replace(/<\/h.>/g, '\n')
    res = res.replace(/<[^>]*>?/g, '')

    if(lenght != "all") {
        res = res.substr(0, lenght)
    }
    return res
}

exports.slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

fromHtml = (html) => {
    html = splitHtml(html)

    for(let i = 0; i < html.length; i++) {
        html[i] = htmlLinkToMarkdown(html[i])
        html[i] = htmlImgToMarkdown(html[i])

        if(html[i].startsWith("<h")) {
            if(html[i].startsWith("<h1")) {
                html[i] = "# " + html[i].replace(/<h1.*?>/, "").replace("</h1>", "")
            }
            else if(html[i].startsWith("<h2")) {
                html[i] = "## " + html[i].replace(/<h2.*?>/, "").replace("</h2>", "")
            }
            else if(html[i].startsWith("<h3")) {
                html[i] = "### " + html[i].replace(/<h3.*?>/, "").replace("</h3>", "")
            }
            else if(html[i].startsWith("<h4")) {
                html[i] = "#### " + html[i].replace(/<h4.*?>/, "").replace("</h4>", "")
            }
            else if(html[i].startsWith("<h5")) {
                html[i] = "##### " + html[i].replace(/<h5.*?>/, "").replace("</h5>", "")
            }
            else {
                html[i] = "###### " + html[i].replace(/<h.*?>/, "").replace("</h6>", "")
            }
        }
        else if(html[i].startsWith("<p")) {
            html[i] = html[i].replace(/<p.*?>/, "").replace("</p>", "")

            while(html[i].match(/<strong.*?>(.*?)<\/strong>/)) {
                html[i] = html[i].replace(new RegExp("<strong.*?>" + RegExp.$1 + "</strong>"), '**' + RegExp.$1 + "**")
            }

            while(html[i].match(/<em.*?>(.*?)<\/em>/)) {
                html[i] = html[i].replace(new RegExp("<em.*?>" + RegExp.$1 + "</em>"), '*' + RegExp.$1 + "*")
            }
        }

        html[i] += "\n"
    }

    html = html.join("<br />")

    return html
}

htmlLinkToMarkdown = (html) => {
    while(html.match(/<a.*?>(.*?)<\/a>/)) {
        text = RegExp.$1
        href = ""
        target = ""
        rel = ""
        if(html.match(/<a.*?href="(.*?)".*?>(.*?)<\/a>/)) {
            href = RegExp.$1
        }
        if(html.match(/<a.*?target="(.*?)".*?>(.*?)<\/a>/)) {
            target = RegExp.$1
            if(target == "_blank") {
                target = "blank"
            }
        }
        if(html.match(/<a.*?rel="(.*?)".*?>(.*?)<\/a>/)) {
            rel = RegExp.$1
        }

        html = html.replace(/<a.*?>(.*?)<\/a>/, "[" + text + "](" + href + ")" + "(" + target + ", " + rel + ")")
    }

    return html
}

htmlImgToMarkdown = (html) => {
    while(html.match(/<img.*?>/)) {
        alt = ""
        src = ""
        if(html.match(/<img.*?alt="(.*?)".*?>/)) {
            alt = RegExp.$1
        }
        if(html.match(/<img.*?src="(.*?)".*?>/)) {
            src = RegExp.$1
        }

        html = html.replace(/<img.*?>/, "![" + alt + "](" + src + ")")
    }

    return html
}

splitHtml = (html) => {
    html = html.replace(/<br>/g, "")
    html = html.replace(/<br\/>/g, "")
    html = html.replace(/<br \/>/g, "")
    html = html.split(/<\/h.>|<\/p>/)
    
    for(let i = 0; i < html.length; i++) {
        if(html[i].startsWith("<h")) {
            html[i].match(/<h(.).*?>/)
            html[i] = html[i] + "</h" + RegExp.$1 + ">"
        }
        else if(html[i].startsWith("<p")) {
            html[i] = html[i] + "</p>"
        }
    }

    return html
}

htmlspecialchars = (str) => {
    if (typeof(str) == "string") {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#039;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/\*/g, "%2A");
        str = str.replace(/_/g, "%5F");
    }
    return str;
}

escapeChars = (line) => {
    line = line.replace(/\\\*/g, "&#42;") // *
    line = line.replace(/\\`/g, "&#96;") // `
    line = line.replace(/\\_/g, "&#95;") // _
    line = line.replace(/\\#/g, "&#35;") // #
    line = line.replace(/\\\+/g, "&#43;") // +
    line = line.replace(/\\-/g, "&#8208;") // -
    line = line.replace(/\\\./g, "&#8228;") // .
    line = line.replace(/\\\!/g, "&#33;") // !

    line = line.replace(/\\{/g, "&#123;") // {
    line = line.replace(/\\}/g, "&#125;") // }

    line = line.replace(/\\\[/g, "&#91;") // [
    line = line.replace(/\\\]/g, "&#93;") // ]

    line = line.replace(/\\\(/g, "&#40;") // (
    line = line.replace(/\\\)/g, "&#41;") // )

    line = line.replace(/\\/g, "&#92;") // \    keep in the end

    return line
}
