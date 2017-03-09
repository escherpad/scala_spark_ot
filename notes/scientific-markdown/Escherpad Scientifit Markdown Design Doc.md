---
front-matter: value
kernel: deep-learning-python3
run-bash: git clone git://repo.git && cd folder/sub-folder/this-script
---

# Scientific Markdown

There are two approaches to this: An executable text format:
1. python code in markdown
or
2. markdown in python code.

The nice thing of the first option is that it puts the markdown first. After all this is a document, not a program script.

On the otherhand, if we go about it with python-first, then the whole file can be executed as python. This means there won't be any problem with running the code anywhere due to lack of support. Like `jsx` with markdown inbetween, the code will be `javascript` first, `xml` second, and finally `markdown`.

That's nice, isn't it?

## R-markdown syntax

Here are some example syntax from r-markdown:
```
    ```python {include=FALSE}
    plot(blah);
    show()
    ```
```

```
    ```{r echo = FALSE, results = 'asis'}
    library(knitr)
    kable(mtcars[1:5, ], caption = "A knitr kable.")
    ```
```

potential syntax
```
    ```python {nodisplay}
    plot(blah);
    show()
    ```
```

## R-markdown Dashboards

to make dashboard:

```markdown
# regular eval
# interactive python

## example dashboard

#{.sidebar} this is the title of the sidebar
content of the sidebar

# tab 1
##{column=1} this is a title
###{box caption="stuff hahaha"} title of box


###{box caption="stuff and this works"} title of second box
content of box this works

    ```r
    num <- reactive(as.integer(input$clusterNum))

    col = colorRampPalette(c("red", "white", "darkblue"), space="Lab")(10)
    renderPlot({
        p = par(mai=c(0,0,0,0))
        heatmapBC(BicatYeast, res, number=num(), xlab="", ylab="",
          order=TRUE, useRaster=TRUE, col=col)
        par(p)
    })
    ```
```

## Python-first with markdown in-between
 p/c  | details   |
:---: | :---
  pro | code is always runnable.
  con | to render, need to parse as python first.

Here is an example:
```python
import numpy

"""
# Title of Document
## Header 1

This is a piece of `code` and we can just show that
\begin{array}
\text{some math}
\end{array}

The nice thing with this is that
1. the code is always executable as python
2. The package management can be done via python.
"""

### {code-cell-id-001, include=FALSE}
print('finished execution');

## section title
"""some text goes here! """
# more python code

```
