# html-div-resizing

*This project contains HTML5/CSS3/ECMAScript code samples how to implements resizable DIVs.*

## Iteration 1

- One DIV with a click handler, that adds a small blue resize handler to resize the DIV in both directions

![iteration-1](docs/images/iteration1.png "A DIV with a simple resize handle")

## Iteration 2

- Four DIVs (panels) with vertical and horizontal resize bars
- The four DIVs are located within a content area, that does not use the complete window (sidebar and header is also present)
- Each panel can be resized
- During resizing the color of the bar is changed to red
- There is a minimal and maximal limit, so that no panel disappears
- The solution handles also resize events of the window itself

![iteration-2](docs/images/iteration2.png "Four DIVs with vertical and horizontal resize bars")

## Iteration 3

- Six DIVs (4 in the left column, 2 in the right column)
- Each row or column can have multiple resizable div, not only two
- The color of the resize handle is controlled completely by CSS `:hover` and `:active`

![iteration-3](docs/images/iteration3.png "Six DIVs with vertical and horizontal resize bars")
