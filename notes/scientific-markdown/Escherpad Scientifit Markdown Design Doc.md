----
front-matter: value
kernel: deep-learning-python3
----

# Scientific Markdown

r-markdown syntax:
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

## Dashboards

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
